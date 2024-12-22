import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../../../../shared/topnavbar/AppTabLandingNavbar';
import { APP_ICON_ENUM } from '../../../../lib/Icon';
import { RefreshControl, ScrollView, View, Text } from 'react-native';
import useGlobalState from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { AppNotificationObject } from '../../../../../types/app-notification.types';
import { AppFlashList } from '../../../../lib/AppFlashList';
import { APP_FONTS } from '../../../../../styles/AppFonts';

type AppNotificationViewContainer = {
	tabType: APP_LANDING_PAGE_TYPE;
	data: AppNotificationObject[];
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
	data,
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
			<AppFlashList.Mentions
				data={data}
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
