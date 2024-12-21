import { useCallback } from 'react';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';

/**
 * Try to resolve (and cache)
 * custom emojis using
 * various methods
 */
function useAppCustomEmoji() {
	const { driver, acct } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
			acct: o.acct,
		})),
	);

	const find = useCallback((id: string, remoteSubdomain?: string): string => {
		return '';
	}, []);

	return { find };
}

export default useAppCustomEmoji;
