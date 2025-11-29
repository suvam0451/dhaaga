import { View, Text, ScrollView } from 'react-native';
import BearError from '#/svgs/BearError';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '#/components/shared/topnavbar/AppTabLandingNavbar';
import { APP_ROUTING_ENUM } from '#/utils/route-list';
import {
	useAppActiveSession,
	useAppTheme,
} from '#/hooks/utility/global-state-extractors';
import { router } from 'expo-router';
import { AppText } from '#/components/lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import {
	AppButtonClassicInverted,
	AppButtonVariantA,
} from '#/components/lib/Buttons';

function AccountLoadError() {
	const { theme } = useAppTheme();
	const { session } = useAppActiveSession();
	return (
		<ScrollView
			style={{
				paddingBottom: 16,
				backgroundColor: theme.palette.bg,
			}}
		>
			<AppTabLandingNavbar
				type={APP_LANDING_PAGE_TYPE.ALL_ACCOUNTS}
				menuItems={[
					{
						iconId: 'user-guide',
						onPress: () => {
							router.navigate(APP_ROUTING_ENUM.GUIDE_SETTINGS_TAB);
						},
					},
				]}
			/>
			<View style={{ width: 128, height: 256, marginHorizontal: 'auto' }}>
				<BearError />
			</View>

			<View style={{ marginTop: 16, marginHorizontal: 32 }}>
				<AppText.SemiBold
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A0}
					style={{ fontSize: 24, textAlign: 'center' }}
				>
					Failed to load account
				</AppText.SemiBold>
				<AppText.Normal
					style={{ marginTop: 12, fontSize: 16, textAlign: 'center' }}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}
					numberOfLines={5}
				>
					{session.error}
				</AppText.Normal>

				<AppButtonVariantA
					style={{ marginTop: 32 }}
					label={'Retry'}
					loading={false}
					onClick={() => {}}
				/>
				<View>
					<AppText.Medium
						style={{
							textAlign: 'center',
							backgroundColor: theme.background.a40,
							padding: 12,
							borderRadius: 8,
							minWidth: 148,
							marginTop: 4,
							marginHorizontal: 'auto',
						}}
					>
						Log In Again
					</AppText.Medium>
				</View>
			</View>
		</ScrollView>
	);
}

export default AccountLoadError;
