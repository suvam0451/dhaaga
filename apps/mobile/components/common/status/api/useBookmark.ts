import { useCallback, useEffect, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { useActivitypubStatusContext } from '../../../../states/useStatus';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';
import { MisskeyRestClient } from '@dhaaga/shared-abstraction-activitypub';

function useBookmark() {
	const { client, domain } = useActivityPubRestClientContext();
	const {
		status: post,
		setDataRaw,
		sharedStatus,
		setSharedDataRaw,
	} = useActivitypubStatusContext();
	const IS_REPOST = post?.isReposted();
	const _status = IS_REPOST ? sharedStatus : post;

	const [IsBookmarked, setIsBookmarked] = useState(null);
	const [IsLoading, setIsLoading] = useState(false);

	useEffect(() => {
		switch (domain) {
			case KNOWN_SOFTWARE.MASTODON: {
				setIsBookmarked(_status?.getIsBookmarked());
				break;
			}
			case KNOWN_SOFTWARE.MISSKEY:
			case KNOWN_SOFTWARE.FIREFISH:
			case KNOWN_SOFTWARE.SHARKEY: {
				(client as MisskeyRestClient).statuses
					.getState(_status?.getId())
					.then(({ data, error }) => {
						setIsBookmarked(data.isFavorited);
					});
				break;
			}
			default: {
			}
		}
	}, [_status]);

	const updateState = useCallback(
		({ data, error }: { data: any; error: any }) => {
			if (error) {
				if (error.code === 'ALREADY_FAVOURITED') {
					setIsBookmarked(true);
					return;
				}
				if (error.code === 'NOT_FAVOURITED') {
					setIsBookmarked(false);
				}
				return;
			}
			switch (domain) {
				case KNOWN_SOFTWARE.MASTODON: {
					if (IS_REPOST) {
						setSharedDataRaw(data);
					} else {
						setDataRaw(data);
					}
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
					break;
				}
				case KNOWN_SOFTWARE.SHARKEY:
				case KNOWN_SOFTWARE.MISSKEY:
				case KNOWN_SOFTWARE.FIREFISH: {
					if (data !== undefined && data.success) {
						setIsBookmarked(data.isBookmarked);
					}
					break;
				}
				default: {
				}
			}
		},
		[],
	);

	function onPress() {
		if (IsLoading) return;
		setIsLoading(true);

		if (IsBookmarked) {
			client.statuses
				.unBookmark(_status.getId())
				.then(updateState)
				.finally(() => {
					setIsLoading(false);
				});
		} else {
			client.statuses
				.bookmark(_status.getId())
				.then(updateState)
				.finally(() => {
					setIsLoading(false);
				});
		}
	}

	return { IsBookmarked, IsLoading, onPress };
}

export default useBookmark;
