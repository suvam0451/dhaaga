import { useCallback } from 'react';

/**
 * Try to resolve (and cache)
 * custom emojis using
 * various methods
 */
function useAppCustomEmoji() {
	const find = useCallback((id: string, remoteSubdomain?: string): string => {
		return '';
	}, []);

	return { find };
}

export default useAppCustomEmoji;
