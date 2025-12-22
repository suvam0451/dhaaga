import {
	FeedTimelineStateAction,
	useFeedTimelineDispatch,
	useFeedTimelineState,
} from '@dhaaga/core';
import AppTimeline from '#/features/timelines/components/AppTimeline';
import { AppTimelineProps } from '#/features/timelines/shared';
import FeedListItemView from '#/features/timelines/view/FeedListItemView';
function FeedTimelineView(props: AppTimelineProps) {
	const State = useFeedTimelineState();
	const dispatch = useFeedTimelineDispatch();

	function fnLoadNextPage(data: any) {
		dispatch({
			type: FeedTimelineStateAction.APPEND_RESULTS,
			payload: data,
		});
	}

	function fnReset() {
		dispatch({
			type: FeedTimelineStateAction.RESET,
		});
	}

	function fnLoadMore() {
		if (
			State.items.length > 0 &&
			props.queryResult.fetchStatus !== 'fetching'
		) {
			dispatch({
				type: FeedTimelineStateAction.REQUEST_LOAD_MORE,
			});
		}
	}

	return (
		<AppTimeline
			{...props}
			items={State.items}
			renderItem={({ item }) => <FeedListItemView item={item} />}
			fnLoadNextPage={fnLoadNextPage}
			fnLoadMore={fnLoadMore}
			fnReset={fnReset}
		/>
	);
}

export default FeedTimelineView;
