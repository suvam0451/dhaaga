import { memo } from 'react';
import useApiGetUpdateNotifs from '../api/useApiGetUpdateNotifs';
import AppNotificationViewContainer from './_container';
import { APP_LANDING_PAGE_TYPE } from '../../../../shared/topnavbar/AppTabLandingNavbar';

const SocialView = memo(() => {
	const { data } = useApiGetUpdateNotifs();

	return (
		<AppNotificationViewContainer
			data={[]}
			tabType={APP_LANDING_PAGE_TYPE.SOCIAL}
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

export default SocialView;
