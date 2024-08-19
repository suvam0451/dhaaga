import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { useEffect, useRef, useState } from 'react';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';
import { MisskeyRestClient } from '@dhaaga/shared-abstraction-activitypub';
import * as Haptics from 'expo-haptics';
import { ActivityPubStatusAppDtoType } from '../../../../services/ap-proto/activitypub-status-dto.service';

function useBoost(dto: ActivityPubStatusAppDtoType) {
	const { client, domain, me } = useActivityPubRestClientContext();

	const Renotes = useRef([]);

	const [IsBoosted, setIsBoosted] = useState(null);
	const [IsLoading, setIsLoading] = useState(false);

	function updateState({ data, error }: { data: any; error: any }) {
		if (data) {
			Renotes.current = data.map((o) => {
				return {
					name: o.user.name,
					id: o.user.id,
					// raw: o.user,
				};
			});
			if (Renotes.current.find((o) => o.id === me?.getId())) setIsBoosted(true);
		}
	}

	function updateAfterClick({ data, error }: { data: any; error: any }) {
		if (error) return;
		if (data.success) {
			setIsBoosted(data.renoted);
		}
	}

	useEffect(() => {
		Renotes.current = [];
		switch (domain) {
			case KNOWN_SOFTWARE.MASTODON: {
				setIsBoosted(dto.interaction.boosted);
				break;
			}
			case KNOWN_SOFTWARE.MISSKEY:
			case KNOWN_SOFTWARE.FIREFISH:
			case KNOWN_SOFTWARE.SHARKEY: {
				(client as MisskeyRestClient).statuses
					.renotes(dto.id)
					.then(updateState);
				break;
			}
			default: {
			}
		}
	}, [dto]);

	function onPress() {
		if (IsLoading) return;
		setIsLoading(true);

		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		switch (domain) {
			case KNOWN_SOFTWARE.MISSKEY:
			case KNOWN_SOFTWARE.FIREFISH:
			case KNOWN_SOFTWARE.SHARKEY: {
				if (IsBoosted) {
					(client as MisskeyRestClient).statuses
						.unrenote(dto.id)
						.then(updateAfterClick)
						.finally(() => {
							setIsLoading(false);
						});
				} else {
					(client as MisskeyRestClient).statuses
						.renote({
							renoteId: dto.id,
							visibility: 'followers',
							localOnly: true,
						})
						.then(updateAfterClick)
						.finally(() => {
							setIsLoading(false);
						});
				}
				break;
			}
			case KNOWN_SOFTWARE.MASTODON: {
				break;
			}
			default: {
				setIsLoading(false);
				break;
			}
		}
	}

	return { IsBoosted, IsLoading, onPress };
}

export default useBoost;
