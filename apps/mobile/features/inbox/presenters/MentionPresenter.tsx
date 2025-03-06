import { useEffect, useMemo, useState } from 'react';
import { APP_LANDING_PAGE_TYPE } from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import { useApiGetMentionUpdates } from '../../../hooks/api/useNotifications';
import { FlatList, RefreshControl } from 'react-native';
import NotificationItemPresenter from './NotificationItemPresenter';
import Header from '../components/Header';
import FlashListService from '../../../services/flashlist.service';
import useNotificationStore from '../interactors/useNotificationStore';
import { NotificationSkeletonView } from '../components/Skeleton';

function MentionPresenter() {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { state, loadNext, maxId, append, reset } = useNotificationStore();
	const { data, refetch, isPending, fetchStatus, isRefetching } =
		useApiGetMentionUpdates(maxId);

	useEffect(() => {
		if (fetchStatus !== 'fetching') {
			append(data);
		}
	}, [fetchStatus]);

	function refresh() {
		setIsRefreshing(true);
		reset();
		refetch().finally(() => {
			setIsRefreshing(false);
		});
	}

	const [NumNodes, setNumNodes] = useState(0);
	function onLayout(event: any) {
		setNumNodes(Math.floor(event.nativeEvent.layout.height / 136));
	}

	const listItems = useMemo(() => {
		return FlashListService.notifications(state.items);
	}, [state.items]);

	// if (listItems.length === 0 && (isPending || isRefetching))
	// 	return (
	// 		<NotificationSkeletonPresenter
	// 			Header={<Header type={APP_LANDING_PAGE_TYPE.MENTIONS} />}
	// 		/>
	// 	);

	const IS_LOADING = listItems.length === 0 && (isPending || isRefetching);

	return (
		<FlatList
			onLayout={onLayout}
			data={IS_LOADING ? Array(NumNodes).fill(null) : listItems}
			renderItem={({ item }) =>
				IS_LOADING ? (
					<NotificationSkeletonView />
				) : (
					<NotificationItemPresenter item={item} />
				)
			}
			ListHeaderComponent={<Header type={APP_LANDING_PAGE_TYPE.MENTIONS} />}
			refreshControl={
				<RefreshControl refreshing={IsRefreshing} onRefresh={refresh} />
			}
			contentContainerStyle={{
				paddingBottom: 32,
			}}
			onEndReached={() => {
				if (!isPending) loadNext();
			}}
		/>
	);
}

export default MentionPresenter;
