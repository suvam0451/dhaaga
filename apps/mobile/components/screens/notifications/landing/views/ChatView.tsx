import { memo, useState } from 'react';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../../../../shared/topnavbar/AppTabLandingNavbar';
import { useApiGetChatUpdates } from '../../../../../hooks/api/useNotifications';
import {
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import { AppFlashList } from '../../../../lib/AppFlashList';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { useAppTheme } from '../../../../../hooks/utility/global-state-extractors';

const ChatView = memo(() => {
	const { refetch, data } = useApiGetChatUpdates();

	const [IsRefreshing, setIsRefreshing] = useState(false);

	function onRefresh() {
		refetch();
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

const styles = StyleSheet.create({
	tipText: {
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
		textAlign: 'center',
		marginHorizontal: 10,
		marginBottom: 16,
	},
});
