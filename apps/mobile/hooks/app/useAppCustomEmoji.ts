import { useGlobalMmkvContext } from '../../states/useGlobalMMkvCache';
import { useRealm } from '@realm/react';
import { useCallback } from 'react';
import { EmojiService } from '../../services/emoji.service';
import { useActivityPubRestClientContext } from '../../states/useActivityPubRestClient';

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

	const refresh = useCallback((subdomain: string, software?: string) => {
		EmojiService.downloadCustomEmojis(globalDb, subdomain, software).then(
			(res) => {
				if (!res.success) {
					console.log('[INFO]: custom emoji refresh status', res);
				}
			},
		);
	}, []);

	return { find, refresh };
}

export default useAppCustomEmoji;
