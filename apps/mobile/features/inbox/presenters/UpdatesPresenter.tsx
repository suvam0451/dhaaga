import { APP_LANDING_PAGE_TYPE } from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import AppNotificationViewContainer from '../components/InboxTabFactory';
import { useApiGetSubscriptionUpdates } from '../../../hooks/api/useNotifications';
import { useState } from 'react';
import useNotificationStore from '../interactors/useNotificationStore';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';

function UpdatesPresenter() {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { data, refetch } = useApiGetSubscriptionUpdates();
	const { state, loadNext } = useNotificationStore();

	function refresh() {
		setIsRefreshing(true);
		refetch().finally(() => {
			setIsRefreshing(false);
		});
	}

	const { onScroll } = useScrollMoreOnPageEnd({
		itemCount: state.items.length,
		updateQueryCache: loadNext,
	});

	return (
		<AppNotificationViewContainer
			data={data.items}
			tabType={APP_LANDING_PAGE_TYPE.UPDATES}
			refreshing={IsRefreshing}
			onRefresh={refresh}
			onScroll={onScroll}
		/>
	);
}

export default UpdatesPresenter;
