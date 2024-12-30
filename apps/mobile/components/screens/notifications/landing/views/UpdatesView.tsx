import { memo } from 'react';
import { APP_LANDING_PAGE_TYPE } from '../../../../shared/topnavbar/AppTabLandingNavbar';
import AppNotificationViewContainer from './_container';
import { useApiGetSocialUpdates } from '../../../../../hooks/api/useNotifications';

const UpdatesView = memo(() => {
	const { data } = useApiGetSocialUpdates();

	return (
		<AppNotificationViewContainer
			data={[]}
			tabType={APP_LANDING_PAGE_TYPE.UPDATES}
			menuItems={[
				{
					iconId: 'cog',
				},
				{
					iconId: 'user-guide',
				},
			]}
			tip={'These are updates from accounts you follow.'}
		/>
	);
});

export default UpdatesView;
