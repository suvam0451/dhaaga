import { Dispatch, SetStateAction } from 'react';
import {
	useTimelineManager,
	useTimelineState,
} from '../../components/context-wrappers/WithPostTimeline';

/**
 * Allows performing actions against a post
 * using the nearest contextual manager
 * available
 *
 * NOTE: The context manager for the bottom sheets
 * should be made local to the sheet itself.
 *
 * However, the other contexts (TimelineSessionService)
 * may be passed around as reference
 *
 * --- Priority ---
 *
 * details page > timeline > sheet
 */
export function usePostActionsInterface() {
	const TimelineState = useTimelineState();
	const TimelineManager = useTimelineManager();

	async function toggleLike(
		key: string,
		loader?: Dispatch<SetStateAction<boolean>>,
	) {
		if (TimelineManager.current) {
			if (loader) loader(true);
			await TimelineManager.current.toggleLike(TimelineState, key);
			if (loader) loader(false);
		}

		// console.log('[WARN]: no interface available to handle ');
	}

	async function toggleBookmark(key: string) {
		if (TimelineManager.current) {
			await TimelineManager.current.toggleBookmark(TimelineState, key);
		}

		// console.log('[WARN]: no interface available to handle ');
	}

	async function finalizeBookmarkState(key: string) {
		if (TimelineManager.current) {
			await TimelineManager.current.finalizeBookmarkState(TimelineState, key);
		}
	}

	return { toggleLike, toggleBookmark, finalizeBookmarkState };
}
