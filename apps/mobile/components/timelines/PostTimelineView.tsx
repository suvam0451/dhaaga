import {
	PostTimelineStateAction,
	usePostTimelineDispatch,
	usePostTimelineState,
} from '@dhaaga/core';
import WithAppStatusItemContext from '#/components/containers/WithPostItemContext';
import { TimelineFilter_EmojiCrash } from '#/components/common/status/TimelineFilter_EmojiCrash';
import PostTimelineEntryView from '#/features/post-item/PostTimelineEntryView';
import AppTimeline from '#/components/timelines/AppTimeline';
import { AppTimelineProps } from '#/components/timelines/shared';

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
		dispatch({
			type: PostTimelineStateAction.REQUEST_LOAD_MORE,
		});
	}

	return (
		<AppTimeline
			{...props}
			items={State.items}
			renderItem={({ item }) => (
				<WithAppStatusItemContext dto={item}>
					<TimelineFilter_EmojiCrash>
						<PostTimelineEntryView />
					</TimelineFilter_EmojiCrash>
				</WithAppStatusItemContext>
			)}
			fnLoadNextPage={fnLoadNextPage}
			fnLoadMore={fnLoadMore}
			fnReset={fnReset}
		/>
	);
}

export default PostTimelineView;
