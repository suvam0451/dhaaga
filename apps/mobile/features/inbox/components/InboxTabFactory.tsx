import { APP_LANDING_PAGE_TYPE } from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import { RefreshControl } from 'react-native';
import { AppNotificationObject } from '../../../types/app-notification.types';
import { AppFlashList } from '../../../components/lib/AppFlashList';
import Header from './Header';

type AppNotificationViewContainer = {
	tabType: APP_LANDING_PAGE_TYPE;
	data: AppNotificationObject[];
	refreshing?: boolean;
	onRefresh?: () => void;
};

function AppNotificationViewContainer({
	data,
	tabType,
	onRefresh,
	refreshing,
}: AppNotificationViewContainer) {
	return (
		<AppFlashList.Mentions
			data={data}
			ListHeaderComponent={<Header type={tabType} />}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		/>
	);
}

export default AppNotificationViewContainer;
