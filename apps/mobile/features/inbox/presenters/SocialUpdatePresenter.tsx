import { memo, useState } from 'react';
import AppNotificationViewContainer from '../components/InboxTabFactory';
import { APP_LANDING_PAGE_TYPE } from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import { useApiGetSocialUpdates } from '../../../hooks/api/useNotifications';

const SocialUpdatePresenter = memo(() => {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { data, refetch } = useApiGetSocialUpdates();

	function refresh() {
		setIsRefreshing(true);
		refetch().finally(() => {
			setIsRefreshing(false);
		});
	}

	return (
		<AppNotificationViewContainer
			data={data.items}
			tabType={APP_LANDING_PAGE_TYPE.SOCIAL}
			refreshing={IsRefreshing}
			onRefresh={refresh}
		/>
	);
});

export default SocialUpdatePresenter;
