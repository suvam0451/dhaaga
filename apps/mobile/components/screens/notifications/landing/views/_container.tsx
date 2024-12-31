import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../../../../shared/topnavbar/AppTabLandingNavbar';
import { APP_ICON_ENUM } from '../../../../lib/Icon';
import {
	RefreshControl,
	ScrollView,
	View,
	Text,
	StyleSheet,
} from 'react-native';
import { AppNotificationObject } from '../../../../../types/app-notification.types';
import { AppFlashList } from '../../../../lib/AppFlashList';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { useAppTheme } from '../../../../../hooks/utility/global-state-extractors';

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
	const { theme } = useAppTheme();

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
							style={[
								styles.tipText,
								{
									color: theme.secondary.a20,
								},
							]}
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

const styles = StyleSheet.create({
	tipText: {
		fontSize: 14,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		textAlign: 'center',
		marginHorizontal: 10,
		marginBottom: 16,
	},
});
