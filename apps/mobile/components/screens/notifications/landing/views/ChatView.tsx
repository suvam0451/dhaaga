import { memo } from 'react';
import { APP_LANDING_PAGE_TYPE } from '../../../../shared/topnavbar/AppTabLandingNavbar';
import AppNotificationViewContainer from './_container';
import useApiGetChat from '../../../../../hooks/api/notifications/useApiGetChat';

const ChatView = memo(() => {
	const { refetch, data } = useApiGetChat();

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
			onRefresh={refetch}
		/>
	);
});

export default ChatView;
