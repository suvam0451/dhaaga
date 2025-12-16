import { useApiGetSubscriptionUpdates } from '#/hooks/api/useNotifications';
import { useEffect } from 'react';
import {
	SubscriptionGalleryStateAction,
	useSubscriptionGalleryDispatch,
	useSubscriptionGalleryState,
} from '@dhaaga/react';
import { useAppApiClient } from '#/states/global/hooks';
import AppTimeline from '#/components/timelines/AppTimeline';
import WithAppStatusItemContext from '#/components/containers/WithPostItemContext';
import { TimelineFilter_EmojiCrash } from '#/components/common/status/TimelineFilter_EmojiCrash';
import PostTimelineEntryView from '#/features/post-item/PostTimelineEntryView';

function Generator() {
	const { client } = useAppApiClient();
	const State = useSubscriptionGalleryState();
	const dispatch = useSubscriptionGalleryDispatch();
	const queryResult = useApiGetSubscriptionUpdates(State.maxId);

	useEffect(() => {
		dispatch({
			type: SubscriptionGalleryStateAction.RESET,
		});
	}, [client?.key]);

	useEffect(() => {
		if (queryResult.fetchStatus === 'fetching' || queryResult.error) return;
		dispatch({
			type: SubscriptionGalleryStateAction.APPEND,
			payload: queryResult.data,
		});
	}, [queryResult.fetchStatus]);

	function fnLoadMore() {
		if (State.items.length > 0 && queryResult.fetchStatus !== 'fetching') {
			dispatch({
				type: SubscriptionGalleryStateAction.LOAD_NEXT_PAGE,
			});
		}
	}

	function fnLoadNextPage(data: any) {
		dispatch({
			type: SubscriptionGalleryStateAction.APPEND,
			payload: data,
		});
	}

	function fnReset() {
		dispatch({
			type: SubscriptionGalleryStateAction.RESET,
		});
	}

	return (
		<>
			<AppTimeline
				queryResult={queryResult}
				items={State.items.map((o) => o.post)}
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
				label={null}
				navbarType={'inbox'}
				flatListKey={'inbox/subscriptions'}
			/>
		</>
	);
}

function UpdatesPresenter() {
	return <Generator />;
}

export default UpdatesPresenter;
