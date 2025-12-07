import { useEffect, useMemo, useState } from 'react';
import { APP_LANDING_PAGE_TYPE } from '#/components/shared/topnavbar/AppTabLandingNavbar';
import { useApiGetMentionUpdates } from '#/hooks/api/useNotifications';
import NotificationItemPresenter from './NotificationItemPresenter';
import Header from '../components/Header';
import FlashListService from '#/services/flashlist.service';
import useNotificationStore from '../interactors/useNotificationStore';
import { FlatList, RefreshControl } from 'react-native';
import { StateIndicator } from '../components/StateIndicator';

function MentionPresenter() {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { state, loadNext, maxId, append, reset } = useNotificationStore();
	const queryResult = useApiGetMentionUpdates(maxId);
	const { data, refetch, isPending, fetchStatus, error } = queryResult;

	useEffect(() => {
		if (fetchStatus !== 'fetching' && !error) append(data);
	}, [fetchStatus]);

	async function refresh() {
		reset();
		await refetch();
	}

	const listItems = useMemo(() => {
		return FlashListService.notifications(state.items);
	}, [state.items]);

	const [ContainerHeight, setContainerHeight] = useState(0);
	function onLayout(event: any) {
		setContainerHeight(event.nativeEvent.layout.height);
	}

	function _onRefresh() {
		setIsRefreshing(true);
		refresh().finally(() => {
			setIsRefreshing(false);
		});
	}

	return (
		<FlatList
			onLayout={onLayout}
			data={listItems}
			renderItem={({ item }) => <NotificationItemPresenter item={item} />}
			ListHeaderComponent={<Header type={APP_LANDING_PAGE_TYPE.MENTIONS} />}
			refreshControl={
				<RefreshControl refreshing={IsRefreshing} onRefresh={_onRefresh} />
			}
			contentContainerStyle={{
				paddingBottom: 32,
			}}
			ListEmptyComponent={
				<StateIndicator
					numItems={listItems.length}
					containerHeight={ContainerHeight}
					queryResult={queryResult}
				/>
			}
			onEndReached={() => {
				if (!isPending) loadNext();
			}}
		/>
	);
}

export default MentionPresenter;
