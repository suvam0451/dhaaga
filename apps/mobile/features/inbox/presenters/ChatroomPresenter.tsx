import { useState } from 'react';
import { APP_LANDING_PAGE_TYPE } from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import { useApiGetChatUpdates } from '../../../hooks/api/useNotifications';
import { RefreshControl } from 'react-native';
import { AppFlashList } from '../../../components/lib/AppFlashList';
import { useAppApiClient } from '../../../hooks/utility/global-state-extractors';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import AppNotificationViewContainer from '../components/InboxTabFactory';
import Header from '../components/Header';

function ChatroomPresenter() {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { driver } = useAppApiClient();
	const { refetch, data } = useApiGetChatUpdates();

	function refresh() {
		setIsRefreshing(true);
		refetch().finally(() => {
			setIsRefreshing(false);
		});
	}

	if (driver !== KNOWN_SOFTWARE.BLUESKY) {
		return (
			<AppNotificationViewContainer
				tabType={APP_LANDING_PAGE_TYPE.CHAT}
				data={[]}
				refreshing={IsRefreshing}
				onRefresh={refresh}
			/>
		);
	}

	return (
		<AppFlashList.Chatrooms
			data={data}
			ListHeaderComponent={<Header type={APP_LANDING_PAGE_TYPE.CHAT} />}
			refreshControl={
				<RefreshControl refreshing={IsRefreshing} onRefresh={refresh} />
			}
		/>
	);
}

export default ChatroomPresenter;
