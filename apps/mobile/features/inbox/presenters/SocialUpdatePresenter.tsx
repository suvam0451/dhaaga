import { useEffect, useMemo, useState } from 'react';
import { APP_LANDING_PAGE_TYPE } from '#/components/shared/topnavbar/AppTabLandingNavbar';
import { useApiGetSocialUpdates } from '#/hooks/api/useNotifications';
import useNotificationStore from '../interactors/useNotificationStore';
import NotificationItemPresenter from './NotificationItemPresenter';
import Header from '../components/Header';
import FlashListService from '#/services/flashlist.service';
import { FlatList, RefreshControl } from 'react-native';
import { StateIndicator } from '../components/StateIndicator';

function SocialUpdatePresenter() {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { state, loadNext, maxId, append, reset } = useNotificationStore();
	const queryResult = useApiGetSocialUpdates(maxId);
	const { data, fetchStatus, refetch, isPending } = queryResult;

	useEffect(() => {
		if (fetchStatus !== 'fetching') {
			append(data);
		}
	}, [fetchStatus]);

	async function refresh() {
		reset();
		await refetch();
	}

	function _onRefresh() {
		setIsRefreshing(true);
		refresh().finally(() => {
			setIsRefreshing(false);
		});
	}

	const listItems = useMemo(() => {
		return FlashListService.notifications(state.items);
	}, [state.items]);

	const [ContainerHeight, setContainerHeight] = useState(0);
	function onLayout(event: any) {
		setContainerHeight(event.nativeEvent.layout.height);
	}

	return (
		<FlatList
			onLayout={onLayout}
			data={listItems}
			renderItem={({ item }) => <NotificationItemPresenter item={item} />}
			ListHeaderComponent={<Header type={APP_LANDING_PAGE_TYPE.SOCIAL} />}
			refreshControl={
				<RefreshControl refreshing={IsRefreshing} onRefresh={_onRefresh} />
			}
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

export default SocialUpdatePresenter;
