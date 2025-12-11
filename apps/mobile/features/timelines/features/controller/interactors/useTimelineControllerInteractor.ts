import { useEffect, useRef, useState } from 'react';
import { DhaagaJsTimelineQueryOptions } from '@dhaaga/bridge';
import { useAppBottomSheet } from '#/states/global/hooks';

const OPTION_GROUP_A = ['local', 'remote'];
const OPTION_GROUP_B = ['media-only'];

/**
 * Helps perform updates on a timeline
 * opts/query inputs
 */
function useTimelineControllerInteractor() {
	const FeedSelected = useRef(new Set(['all']));
	const MediaSelected = useRef(new Set(['all']));

	const { ctx, stateId, hide } = useAppBottomSheet();
	const [HideReplies, setHideReplies] = useState(false);
	const [HideReposts, setHideReposts] = useState(false);

	const [Draft, setDraft] = useState<DhaagaJsTimelineQueryOptions>(null);

	/**
	 * On invocation, create a copy of the query options
	 */
	useEffect(() => {
		if (ctx.$type !== 'set-feed-options') return;
		setDraft(ctx);
	}, [stateId]);

	useEffect(() => {
		if (!Draft) return;

		const opts = Draft;
		if (opts?.onlyMedia) {
			MediaSelected.current.clear();
			MediaSelected.current.add('media-only');
		}
		if (opts?.local) FeedSelected.current.add('local');
		if (opts?.remote) FeedSelected.current.add('remote');
		if (opts?.local || opts?.remote) FeedSelected.current.delete('all');
		if (opts?.excludeReplies) setHideReplies(true);
		if (opts?.excludeReblogs) setHideReposts(true);
	}, [Draft]);

	/**
	 * Publishes the changes to the timeline
	 */
	function broadcastChanges() {
		hide();
		// dispatch({
		// 	type: PostTimelineStateAction.SET_QUERY_OPTS,
		// 	payload: Draft,
		// });
	}

	function onFeedOptAllSelected() {
		FeedSelected.current.clear();
		FeedSelected.current.add('all');
		// broadcastChanges();
	}

	function onMediaOptAllSelected() {
		MediaSelected.current.clear();
		MediaSelected.current.add('all');
		// broadcastChanges();
	}

	function onFeedOptSelected(index: number) {
		FeedSelected.current.clear();
		FeedSelected.current.add(OPTION_GROUP_A[index]);
		FeedSelected.current.delete('all');
		// broadcastChanges();
	}

	function onMediaOptSelected(index: number) {
		MediaSelected.current.clear();
		MediaSelected.current.add(OPTION_GROUP_B[index]);
		MediaSelected.current.delete('all');
		// broadcastChanges();
	}

	return {
		FeedOpt: FeedSelected.current,
		MediaOpt: MediaSelected.current,
		onFeedOptSelected,
		onFeedOptAllSelected,
		onMediaOptSelected,
		onMediaOptAllSelected,
		broadcastChanges,
		HideReplies,
		HideReposts,
		setHideReplies,
		setHideReposts,
	};
}

export default useTimelineControllerInteractor;
