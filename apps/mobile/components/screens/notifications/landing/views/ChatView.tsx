import { memo } from 'react';
import { APP_LANDING_PAGE_TYPE } from '../../../../shared/topnavbar/AppTabLandingNavbar';
import AppNotificationViewContainer from './_container';
import { useApiGetChatUpdates } from '../../../../../hooks/api/useNotifications';

const ChatView = memo(() => {
	const { refetch, data } = useApiGetChatUpdates();

	return (
		<AppNotificationViewContainer
			data={[]}
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
