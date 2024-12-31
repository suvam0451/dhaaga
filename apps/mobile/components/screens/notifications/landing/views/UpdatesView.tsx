import { memo } from 'react';
import { APP_LANDING_PAGE_TYPE } from '../../../../shared/topnavbar/AppTabLandingNavbar';
import AppNotificationViewContainer from './_container';
import { useApiGetSubscriptionUpdates } from '../../../../../hooks/api/useNotifications';

const UpdatesView = memo(() => {
	const { data } = useApiGetSubscriptionUpdates();

	return (
		<AppNotificationViewContainer
			data={data.data}
			tabType={APP_LANDING_PAGE_TYPE.UPDATES}
			menuItems={[
				{
					iconId: 'cog',
				},
				{
					iconId: 'user-guide',
				},
			]}
			tip={'These are updates from accounts you have subscribed to.'}
		/>
	);
});

export default UpdatesView;
