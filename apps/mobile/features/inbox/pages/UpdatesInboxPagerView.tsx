import { useApiGetSubscriptionUpdates } from '#/hooks/api/useNotifications';
import { useEffect } from 'react';
import {
	SubscriptionGalleryCtx,
	SubscriptionGalleryStateAction,
	useSubscriptionGalleryDispatch,
	useSubscriptionGalleryState,
} from '@dhaaga/react';
import { useAppApiClient } from '#/states/global/hooks';
import AppTimeline from '#/features/timelines/components/AppTimeline';
import TimelinePostItemView from '#/features/post-item-view/TimelinePostItemView';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useTranslation } from 'react-i18next';

function Generator() {
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	const { client } = useAppApiClient();
	const State = useSubscriptionGalleryState();
	const dispatch = useSubscriptionGalleryDispatch();
	const queryResult = useApiGetSubscriptionUpdates(State.appliedMaxId);

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
		<AppTimeline
			queryResult={queryResult}
			items={State.items.map((o) => o.post)}
			renderItem={({ item }) => <TimelinePostItemView post={item} />}
			fnLoadNextPage={fnLoadNextPage}
			fnLoadMore={fnLoadMore}
			fnReset={fnReset}
			label={t(`inbox.nav.updates`)}
			navbarType={'updates'}
			flatListKey={'inbox/subscriptions'}
			skipTimelineInit={true}
			itemType={'social-update'}
		/>
	);
}

function UpdatesInboxPagerView() {
	return (
		<SubscriptionGalleryCtx>
			<Generator />
		</SubscriptionGalleryCtx>
	);
}

export default UpdatesInboxPagerView;
