import { View, ScrollView } from 'react-native';
import BearError from '#/components/svgs/BearError';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '#/components/shared/topnavbar/AppTabLandingNavbar';
import { APP_ROUTING_ENUM } from '#/utils/route-list';
import {
	useAppActiveSession,
	useAppGlobalStateActions,
	useAppTheme,
} from '#/hooks/utility/global-state-extractors';
import { router } from 'expo-router';
import { AppText } from '#/components/lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { AppButtonVariantA } from '#/components/lib/Buttons';

function AccountLoadError() {
	const { theme } = useAppTheme();
	const { session } = useAppActiveSession();
	const { restoreSession } = useAppGlobalStateActions();
	return (
		<ScrollView
			style={{
				paddingBottom: 16,
				backgroundColor: theme.palette.bg,
			}}
		>
			<AppTabLandingNavbar
				type={APP_LANDING_PAGE_TYPE.MY_PROFILE}
				menuItems={[
					{
						iconId: 'user-guide',
						onPress: () => {
							router.navigate(APP_ROUTING_ENUM.GUIDE_SETTINGS_TAB);
						},
					},
				]}
			/>
			<View style={{ width: 128, height: 196, marginHorizontal: 'auto' }}>
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
					loading={session.state === 'loading'}
					onClick={restoreSession}
				/>
				<AppButtonVariantA
					style={{ marginTop: 8 }}
					label={'Reset Token'}
					loading={false}
					variant={'secondary'}
					onClick={() => {}}
				/>
			</View>
		</ScrollView>
	);
}

export default AccountLoadError;
