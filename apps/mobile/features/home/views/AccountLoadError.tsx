import { ScrollView } from 'react-native';
import BearError from '#/components/svgs/BearError';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '#/components/shared/topnavbar/AppTabLandingNavbar';
import { APP_ROUTING_ENUM } from '#/utils/route-list';
import {
	useAppActiveSession,
	useAppGlobalStateActions,
	useAppTheme,
} from '#/states/global/hooks';
import { router } from 'expo-router';
import { AppButtonVariantA } from '#/components/lib/Buttons';
import ErrorPageBuilder from '#/ui/ErrorPageBuilder';

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
							router.navigate(APP_ROUTING_ENUM.PROFILE_GUIDE_ACCOUNTS);
						},
					},
				]}
			/>
			<ErrorPageBuilder
				stickerArt={<BearError />}
				errorMessage={'Failed to load account'}
				errorDescription={session.error}
			>
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
			</ErrorPageBuilder>
		</ScrollView>
	);
}

export default AccountLoadError;
