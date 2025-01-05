import { memo, useState } from 'react';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../../../../shared/topnavbar/AppTabLandingNavbar';
import { useApiGetChatUpdates } from '../../../../../hooks/api/useNotifications';
import { RefreshControl, ScrollView, View } from 'react-native';
import { AppFlashList } from '../../../../lib/AppFlashList';
import { useAppApiClient } from '../../../../../hooks/utility/global-state-extractors';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import AppNotificationViewContainer from './_container';

const ChatView = memo(() => {
	const { driver } = useAppApiClient();
	const { refetch, data } = useApiGetChatUpdates();

	const [IsRefreshing, setIsRefreshing] = useState(false);

	function onRefresh() {
		refetch();
	}

	if (driver !== KNOWN_SOFTWARE.BLUESKY) {
		return (
			<AppNotificationViewContainer
				menuItems={[
					{
						iconId: 'user-guide',
					},
				]}
				tabType={APP_LANDING_PAGE_TYPE.MENTIONS}
				tip={'Chat has only been implemented for Bluesky.'}
				data={[]}
				refreshing={IsRefreshing}
				onRefresh={onRefresh}
			/>
		);
	}

	return (
		<ScrollView
			refreshControl={
				<RefreshControl refreshing={IsRefreshing} onRefresh={onRefresh} />
			}
		>
			<AppFlashList.Chatrooms
				data={data}
				ListHeaderComponent={
					<View>
						<AppTabLandingNavbar
							type={APP_LANDING_PAGE_TYPE.CHAT}
							menuItems={[
								{
									iconId: 'user-guide',
								},
							]}
						/>
						<View style={{ marginBottom: 16 }} />
					</View>
				}
			/>
		</ScrollView>
	);
});

export default ChatView;
