import {
	RefreshControl,
	ScrollView,
	StyleProp,
	StyleSheet,
	View,
	ViewStyle,
} from 'react-native';
import { APP_FONTS } from '#/styles/AppFonts';
import { AppIcon } from '#/components/lib/Icon';
import { router } from 'expo-router';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '#/components/shared/topnavbar/AppTabLandingNavbar';
import { useState } from 'react';
import { AccountService } from '@dhaaga/db';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import {
	useActiveUserSession,
	useAppDb,
	useAppGlobalStateActions,
	useAppTheme,
} from '#/states/global/hooks';
import { AppText } from '#/components/lib/Text';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import ProtocolCards from '../components/ProtocolCards';

type AddAccountLandingFragmentProps = {
	containerStyle?: StyleProp<ViewStyle>;
	onSelectSetPagerId: (id: number) => void;
};

/**
 * This UI fragment can be shared with other
 * screens (that might have a different header,
 * but share footer or page decorations)
 * @constructor
 */
export function AddAccountLandingFragment({
	containerStyle,
	onSelectSetPagerId,
}: AddAccountLandingFragmentProps) {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);
	return (
		<View style={containerStyle}>
			<AppText.SemiBold
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
				style={[styles.noAccountText]}
			>
				Select Platform
			</AppText.SemiBold>
			<ProtocolCards onSelectSetPagerId={onSelectSetPagerId} />
			<View style={styles.tipContainer}>
				<AppIcon
					id={'info'}
					size={24}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A50}
				/>
				<AppText.Medium
					style={[
						styles.tipText,
						{
							color: theme.secondary.a50,
						},
					]}
				>
					{t(`onboarding.accountCreationNotSupported`)}
				</AppText.Medium>
			</View>
		</View>
	);
}

/**
 * A full-screen cover when no account is selected
 * @constructor
 */

type AppNoAccountProps = {
	tab: APP_LANDING_PAGE_TYPE;
};

function AddAccountPresenter({ tab }: AppNoAccountProps) {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { theme } = useAppTheme();
	const { acct } = useActiveUserSession();
	const { db } = useAppDb();
	const { restoreSession } = useAppGlobalStateActions();

	function onRefresh() {
		setIsRefreshing(true);
		try {
			// possibly locked because of the added/deleted account
			if (!acct) {
				AccountService.ensureAccountSelection(db);
				restoreSession();
				setIsRefreshing(false);
			}
		} catch (e) {
			setIsRefreshing(false);
		} finally {
			setIsRefreshing(false);
		}
	}

	return (
		<ScrollView
			style={{ height: '100%', backgroundColor: theme.palette.bg }}
			refreshControl={
				<RefreshControl refreshing={IsRefreshing} onRefresh={onRefresh} />
			}
		>
			<AppTabLandingNavbar
				type={tab}
				menuItems={[
					{
						iconId: 'user-guide',
						onPress: () => {
							router.navigate('/user-guide');
						},
					},
				]}
			/>
			<AddAccountLandingFragment onSelectSetPagerId={() => {}} />
		</ScrollView>
	);
}

export default AddAccountPresenter;

const styles = StyleSheet.create({
	noAccountText: {
		fontSize: 24,
		textAlign: 'center',
		fontFamily: APP_FONTS.INTER_700_BOLD,
		marginBottom: 24,
	},
	selectSnsBox: {
		padding: 6,
		flexDirection: 'row',
		alignItems: 'center',
		margin: 10,
		borderRadius: 16,
		paddingHorizontal: 20,
	},
	selectSnsLabel: {
		fontSize: 22,
	},
	tipContainer: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		width: '100%',
		marginTop: 32,
	},
	tipText: {
		marginLeft: 6,
	},
});
