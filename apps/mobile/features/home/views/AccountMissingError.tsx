import { ScrollView } from 'react-native';
import BearError from '#/components/svgs/BearError';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '#/components/shared/topnavbar/AppTabLandingNavbar';
import { APP_ROUTING_ENUM } from '#/utils/route-list';
import {
	useAppActiveSession,
	useAppTheme,
} from '#/hooks/utility/global-state-extractors';
import { router } from 'expo-router';
import { AppButtonVariantA } from '#/components/lib/Buttons';
import ErrorPageBuilder from '#/ui/ErrorPageBuilder';
import RoutingUtils from '#/utils/routing.utils';

function AccountMissingError() {
	const { theme } = useAppTheme();
	const { session } = useAppActiveSession();

	function onPressAccountSelect() {
		RoutingUtils.toAccountManagement();
	}

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
							router.navigate(APP_ROUTING_ENUM.PROFILE_SETTINGS_GUIDE);
						},
					},
				]}
			/>
			<ErrorPageBuilder
				stickerArt={<BearError />}
				errorMessage={'No Account Selected'}
				errorDescription={session.error}
			>
				<AppButtonVariantA
					style={{ marginTop: 32 }}
					label={'Select Now'}
					loading={session.state === 'loading'}
					onClick={onPressAccountSelect}
				/>
			</ErrorPageBuilder>
		</ScrollView>
	);
}

export default AccountMissingError;
