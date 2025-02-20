import { useEffect, useRef, useState } from 'react';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { MisskeyRestClient } from '@dhaaga/bridge';
import * as Haptics from 'expo-haptics';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { PostObjectType } from '@dhaaga/core';

function useBoost(dto: PostObjectType) {
	const { client, driver, me } = useGlobalState(
		useShallow((o) => ({
			me: o.me,
			client: o.router,
			driver: o.driver,
		})),
	);

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
			if (Renotes.current.find((o) => o.id === me.id)) setIsBoosted(true);
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
		switch (driver) {
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
		switch (driver) {
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
