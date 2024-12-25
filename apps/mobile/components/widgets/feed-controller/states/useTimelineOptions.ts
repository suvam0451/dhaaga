import useHookLoadingState from '../../../../states/useHookLoadingState';
import { useEffect, useRef } from 'react';
import { useAppBottomSheet_TimelineReference } from '../../../../hooks/utility/global-state-extractors';
import { AppTimelineReducerActionType } from '../../../../states/reducers/timeline.reducer';

const OPTION_GROUP_A = ['local', 'remote'];
const OPTION_GROUP_B = ['media-only'];

function useTimelineOptions() {
	const { State, forceUpdate } = useHookLoadingState();
	const FeedSelected = useRef(new Set(['all']));
	const MediaSelected = useRef(new Set(['all']));
	const { dispatch, draft } = useAppBottomSheet_TimelineReference();

	const HideReply = useRef(false);
	const HideReblog = useRef(false);

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
		if (opts?.excludeReplies) HideReply.current = true;
		if (opts?.excludeReblogs) HideReblog.current = true;
		forceUpdate();
	}, [draft.opts]);

	/**
	 * Publishes the changes to the timeline
	 */
	function broadcastChanges() {
		dispatch({
			type: AppTimelineReducerActionType.SET_QUERY_OPTS,
			payload: {
				...draft.opts,
				local: FeedSelected.current.has('local'),
				remote: FeedSelected.current.has('remote'),
				onlyMedia: MediaSelected.current.has('media-only'),
				excludeReblogs: HideReblog.current,
				excludeReplies: HideReply.current,
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
		HideReply,
		HideReblog,
		updateLocalState,
	};
}

export default useTimelineOptions;
