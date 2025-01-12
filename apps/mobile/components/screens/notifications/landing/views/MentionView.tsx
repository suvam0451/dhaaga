import { memo, useState } from 'react';
import { APP_LANDING_PAGE_TYPE } from '../../../../shared/topnavbar/AppTabLandingNavbar';
import AppNotificationViewContainer from './_container';
import { useApiGetMentionUpdates } from '../../../../../hooks/api/useNotifications';

const MentionView = memo(() => {
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
			menuItems={[
				{
					iconId: 'user-guide',
				},
			]}
			tabType={APP_LANDING_PAGE_TYPE.MENTIONS}
			tip={'These users have mentioned or replied to you.'}
			data={data.items}
			refreshing={IsRefreshing}
			onRefresh={refresh}
		/>
	);
});

export default MentionView;
