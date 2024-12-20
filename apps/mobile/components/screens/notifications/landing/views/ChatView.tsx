import { memo } from 'react';
import { APP_LANDING_PAGE_TYPE } from '../../../../shared/topnavbar/AppTabLandingNavbar';
import AppNotificationViewContainer from './_container';

const ChatView = memo(() => {
	return (
		<AppNotificationViewContainer
			items={[]}
			menuItems={[
				{
					iconId: 'cog',
				},
				{
					iconId: 'user-guide',
				},
			]}
			tabType={APP_LANDING_PAGE_TYPE.CHAT}
			tip={'Chat has not been implemented in Dhaaga yet.'}
		/>
	);
});

export default ChatView;
