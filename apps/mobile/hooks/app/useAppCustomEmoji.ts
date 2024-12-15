import { useCallback } from 'react';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';

/**
 * Try to resolve (and cache)
 * custom emojis using
 * various methods
 */
function useAppCustomEmoji() {
	const { driver, acct, mmkv } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
			acct: o.acct,
			mmkv: o.mmkv,
		})),
	);

	const find = useCallback((id: string, remoteSubdomain?: string) => {
		// return EmojiService.find({
		// 	db,
		// 	globalDb,
		// 	subdomain: remoteSubdomain || subdomain,
		// 	domain,
		// 	id,
		// });
	}, []);

	return { find };
}

export default useAppCustomEmoji;
