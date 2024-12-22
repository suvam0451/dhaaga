import { Notification_FlatList_Entry } from '../../../../../hooks/api/notifications/useApiGetNotifications';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../../../../shared/topnavbar/AppTabLandingNavbar';
import { APP_ICON_ENUM } from '../../../../lib/Icon';
import FlatListRenderer from '../fragments/FlatListRenderer';
import { FlatList, RefreshControl, ScrollView, Text, View } from 'react-native';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import useGlobalState from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

type AppNotificationViewContainer = {
	tabType: APP_LANDING_PAGE_TYPE;
	items: Notification_FlatList_Entry[];
	tip: string;
	menuItems: {
		iconId: APP_ICON_ENUM;
		onPress?: () => void;
		disabled?: boolean;
	}[];
	refreshing?: boolean;
	onRefresh?: () => void;
};

function AppNotificationViewContainer({
	items,
	tabType,
	menuItems,
	tip,
	onRefresh,
	refreshing,
}: AppNotificationViewContainer) {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

	return (
		<ScrollView
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
		>
			<FlatList
				data={items}
				renderItem={({ item }) => {
					return <FlatListRenderer item={item} />;
				}}
				ListHeaderComponent={
					<View>
						<AppTabLandingNavbar type={tabType} menuItems={menuItems} />
						<Text
							style={{
								color: theme.secondary.a20,
								fontSize: 14,
								fontFamily: APP_FONTS.INTER_500_MEDIUM,
								textAlign: 'left',
								marginHorizontal: 10,
								marginBottom: 16,
							}}
						>
							{tip}
						</Text>
					</View>
				}
			/>
		</ScrollView>
	);
}

export default AppNotificationViewContainer;
