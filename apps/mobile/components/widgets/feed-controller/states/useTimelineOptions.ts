import useHookLoadingState from '../../../../states/useHookLoadingState';
import { useEffect, useRef } from 'react';
import { useTimelineController } from '../../../common/timeline/api/useTimelineController';

const OPTION_GROUP_A = ['local', 'remote'];
const OPTION_GROUP_B = ['media-only'];

function useTimelineOptions() {
	const { State, forceUpdate } = useHookLoadingState();
	const FeedSelected = useRef(new Set(['all']));
	const MediaSelected = useRef(new Set(['all']));
	const { opts, setOpts } = useTimelineController();

	const HideReply = useRef(false);
	const HideReblog = useRef(false);

	useEffect(() => {
		console.log('first tine loading', opts);
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
	}, [opts]);

	function updateQuery() {
		setOpts({
			...opts,
			local: FeedSelected.current.has('local'),
			remote: FeedSelected.current.has('remote'),
			onlyMedia: MediaSelected.current.has('media-only'),
			excludeReblogs: HideReblog.current,
			excludeReplies: HideReply.current,
		});
		forceUpdate();
	}

	function onFeedOptAllSelected() {
		FeedSelected.current.clear();
		FeedSelected.current.add('all');
		updateQuery();
	}

	function onMediaOptAllSelected() {
		MediaSelected.current.clear();
		MediaSelected.current.add('all');
		updateQuery();
	}

	function onFeedOptSelected(index: number) {
		FeedSelected.current.clear();
		FeedSelected.current.add(OPTION_GROUP_A[index]);
		FeedSelected.current.delete('all');
		updateQuery();
	}

	function onMediaOptSelected(index: number) {
		MediaSelected.current.clear();
		MediaSelected.current.add(OPTION_GROUP_B[index]);
		MediaSelected.current.delete('all');
		updateQuery();
	}

	return {
		FeedOpt: FeedSelected.current,
		MediaOpt: MediaSelected.current,
		onFeedOptSelected,
		onFeedOptAllSelected,
		onMediaOptSelected,
		onMediaOptAllSelected,
		State,
		updateQuery,
		HideReply,
		HideReblog,
	};
}

export default useTimelineOptions;
