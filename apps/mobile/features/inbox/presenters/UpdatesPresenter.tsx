import { APP_LANDING_PAGE_TYPE } from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import AppNotificationViewContainer from '../components/InboxTabFactory';
import { useApiGetSubscriptionUpdates } from '../../../hooks/api/useNotifications';
import { useState } from 'react';

function UpdatesPresenter() {
	const [IsRefreshing, setIsRefreshing] = useState(false);

	const { data } = useApiGetSubscriptionUpdates();
	function refresh() {
		setIsRefreshing(true);
		// refetch().finally(() => {
		setIsRefreshing(false);
		// });
	}

	return (
		<AppNotificationViewContainer
			data={data.data}
			tabType={APP_LANDING_PAGE_TYPE.UPDATES}
			refreshing={IsRefreshing}
			onRefresh={refresh}
		/>
	);
}

export default UpdatesPresenter;
