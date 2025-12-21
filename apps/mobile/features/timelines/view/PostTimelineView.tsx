import {
	PostTimelineStateAction,
	usePostTimelineDispatch,
	usePostTimelineState,
} from '@dhaaga/core';
import AppTimeline from '#/features/timelines/components/AppTimeline';
import { AppTimelineProps } from '#/features/timelines/shared';
import TimelinePostItemView from '#/features/post-item-view/TimelinePostItemView';

/**
 * A simple, re-usable timeline renderer
 * with no extra features
 * @constructor
 */
function PostTimelineView(props: AppTimelineProps) {
	const State = usePostTimelineState()!;
	const dispatch = usePostTimelineDispatch()!;

	function fnLoadNextPage(data: any) {
		dispatch({
			type: PostTimelineStateAction.APPEND_RESULTS,
			payload: data,
		});
	}

	function fnReset() {
		dispatch({
			type: PostTimelineStateAction.RESET,
		});
	}

	function fnLoadMore() {
		if (
			State.items.length > 0 &&
			props.queryResult.fetchStatus !== 'fetching'
		) {
			dispatch({
				type: PostTimelineStateAction.REQUEST_LOAD_MORE,
			});
		}
	}

	return (
		<AppTimeline
			{...props}
			items={State.items}
			renderItem={({ item }) => <TimelinePostItemView post={item} />}
			fnLoadNextPage={fnLoadNextPage}
			fnLoadMore={fnLoadMore}
			fnReset={fnReset}
		/>
	);
}

export default PostTimelineView;
