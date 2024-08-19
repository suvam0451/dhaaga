import { useGlobalMmkvContext } from '../../states/useGlobalMMkvCache';
import { useRealm } from '@realm/react';
import { useCallback } from 'react';
import { EmojiService } from '../../services/emoji.service';
import { useActivityPubRestClientContext } from '../../states/useActivityPubRestClient';
import ActivityPubService from '../../services/activitypub.service';

/**
 * Try to resolve (and cache)
 * custom emojis using
 * various methods
 */
function useAppCustomEmoji() {
	const { domain, subdomain } = useActivityPubRestClientContext();
	const { db } = useRealm();
	const { globalDb } = useGlobalMmkvContext();

	const find = useCallback((id: string, remoteSubdomain?: string) => {
		return EmojiService.find({
			db,
			globalDb,
			subdomain: remoteSubdomain || subdomain,
			domain,
			id,
		});
	}, []);

	const refresh = useCallback(
		(subdomain: string, software?: string) => {
			ActivityPubService.syncSoftware(db, subdomain)
				.then((r) => {
					console.log(r);
					EmojiService.downloadCustomEmojis(
						db,
						globalDb,
						subdomain,
						software,
					).then((res) => {
						if (!res.success) {
							console.log('[INFO]: custom emoji refresh status', res);
						} else {
							// console.log('[INFO]: custom emojis found', res);
						}
					});
				})
				.catch((e) => {
					console.log(e);
				});
		},
		[db, globalDb],
	);

	return { find, refresh };
}

export default useAppCustomEmoji;
