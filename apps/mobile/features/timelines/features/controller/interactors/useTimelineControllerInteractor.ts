import useHookLoadingState from '../../../../../states/useHookLoadingState';
import { useEffect, useRef, useState } from 'react';
import { useAppBottomSheet_TimelineReference } from '../../../../../hooks/utility/global-state-extractors';
import { PostTimelineStateAction } from '@dhaaga/core';

const OPTION_GROUP_A = ['local', 'remote'];
const OPTION_GROUP_B = ['media-only'];

/**
 * Helps perform updates on a timeline
 * opts/query inputs
 */
function useTimelineControllerInteractor() {
	const { State, forceUpdate } = useHookLoadingState();
	const FeedSelected = useRef(new Set(['all']));
	const MediaSelected = useRef(new Set(['all']));
	const { dispatch, draft } = useAppBottomSheet_TimelineReference();

	const [HideReplies, setHideReplies] = useState(false);
	const [HideReposts, setHideReposts] = useState(false);

	useEffect(() => {
		if (!draft) return;

		const opts = draft.opts;
		if (opts?.onlyMedia) {
			MediaSelected.current.clear();
			MediaSelected.current.add('media-only');
		}
		if (opts?.local) FeedSelected.current.add('local');
		if (opts?.remote) FeedSelected.current.add('remote');
		if (opts?.local || opts?.remote) FeedSelected.current.delete('all');
		if (opts?.excludeReplies) setHideReplies(true);
		if (opts?.excludeReblogs) setHideReposts(true);
		forceUpdate();
	}, [draft.opts]);

	/**
	 * Publishes the changes to the timeline
	 */
	function broadcastChanges() {
		dispatch({
			type: PostTimelineStateAction.SET_QUERY_OPTS,
			payload: {
				...draft.opts,
				local: FeedSelected.current.has('local'),
				remote: FeedSelected.current.has('remote'),
				onlyMedia: MediaSelected.current.has('media-only'),
				excludeReblogs: HideReposts,
				excludeReplies: HideReplies,
			},
		});
		forceUpdate();
	}

	function onFeedOptAllSelected() {
		FeedSelected.current.clear();
		FeedSelected.current.add('all');
		// broadcastChanges();
		forceUpdate();
	}

	function onMediaOptAllSelected() {
		MediaSelected.current.clear();
		MediaSelected.current.add('all');
		// broadcastChanges();
		forceUpdate();
	}

	function onFeedOptSelected(index: number) {
		FeedSelected.current.clear();
		FeedSelected.current.add(OPTION_GROUP_A[index]);
		FeedSelected.current.delete('all');
		// broadcastChanges();
		forceUpdate();
	}

	function onMediaOptSelected(index: number) {
		MediaSelected.current.clear();
		MediaSelected.current.add(OPTION_GROUP_B[index]);
		MediaSelected.current.delete('all');
		// broadcastChanges();
		forceUpdate();
	}

	function updateLocalState() {
		forceUpdate();
	}

	return {
		FeedOpt: FeedSelected.current,
		MediaOpt: MediaSelected.current,
		onFeedOptSelected,
		onFeedOptAllSelected,
		onMediaOptSelected,
		onMediaOptAllSelected,
		State,
		broadcastChanges,
		HideReplies,
		HideReposts,
		updateLocalState,
		setHideReplies,
		setHideReposts,
	};
}

export default useTimelineControllerInteractor;
