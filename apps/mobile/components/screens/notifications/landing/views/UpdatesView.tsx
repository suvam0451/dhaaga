import { memo } from 'react';
import useApiGetUpdateNotifs from '../api/useApiGetUpdateNotifs';
import { APP_LANDING_PAGE_TYPE } from '../../../../shared/topnavbar/AppTabLandingNavbar';
import AppNotificationViewContainer from './_container';

const UpdatesView = memo(() => {
	const { data } = useApiGetUpdateNotifs();

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
