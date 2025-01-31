import { useState } from 'react';
import { APP_LANDING_PAGE_TYPE } from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import AppNotificationViewContainer from '../components/InboxTabFactory';
import { useApiGetMentionUpdates } from '../../../hooks/api/useNotifications';

function MentionPresenter() {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { data, refetch } = useApiGetMentionUpdates();

	function refresh() {
		setIsRefreshing(true);
		refetch().finally(() => {
			setIsRefreshing(false);
		});
	}

	return (
		<AppNotificationViewContainer
			tabType={APP_LANDING_PAGE_TYPE.MENTIONS}
			data={data.items}
			refreshing={IsRefreshing}
			onRefresh={refresh}
		/>
	);
}

export default MentionPresenter;
