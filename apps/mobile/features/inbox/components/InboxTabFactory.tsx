import { APP_LANDING_PAGE_TYPE } from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import { Animated, RefreshControl } from 'react-native';
import { AppNotificationObject } from '../../../types/app-notification.types';
import Header from './Header';
import NotificationItemPresenter from '../presenters/NotificationItemPresenter';
import { useMemo } from 'react';
import FlashListService from '../../../services/flashlist.service';

type AppNotificationViewContainer = {
	tabType: APP_LANDING_PAGE_TYPE;
	data: AppNotificationObject[];
	refreshing?: boolean;
	onRefresh?: () => void;
	onScroll: () => void;
};

function AppNotificationViewContainer({
	data,
	tabType,
	onRefresh,
	refreshing,
	onScroll,
}: AppNotificationViewContainer) {
	const listItems = useMemo(() => {
		return FlashListService.notifications(data);
	}, [data]);

	return (
		<Animated.FlatList
			data={listItems}
			renderItem={({ item }) => <NotificationItemPresenter item={item} />}
			ListHeaderComponent={<Header type={tabType} />}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
			contentContainerStyle={{
				paddingBottom: 32,
			}}
			onScroll={onScroll}
		/>
	);
}

export default AppNotificationViewContainer;
