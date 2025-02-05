import { useEffect, useMemo, useState } from 'react';
import { APP_LANDING_PAGE_TYPE } from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import { useApiGetSocialUpdates } from '../../../hooks/api/useNotifications';
import useNotificationStore from '../interactors/useNotificationStore';
import { FlatList, RefreshControl } from 'react-native';
import NotificationItemPresenter from './NotificationItemPresenter';
import Header from '../components/Header';
import FlashListService from '../../../services/flashlist.service';

function SocialUpdatePresenter() {
	const [IsRefreshing, setIsRefreshing] = useState(false);

	const { state, loadNext, maxId, append, reset } = useNotificationStore();
	const { data, fetchStatus, refetch, isPending } =
		useApiGetSocialUpdates(maxId);

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

	const listItems = useMemo(() => {
		return FlashListService.notifications(state.items);
	}, [state.items]);

	return (
		<FlatList
			data={listItems}
			renderItem={({ item }) => <NotificationItemPresenter item={item} />}
			ListHeaderComponent={<Header type={APP_LANDING_PAGE_TYPE.SOCIAL} />}
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

export default SocialUpdatePresenter;
