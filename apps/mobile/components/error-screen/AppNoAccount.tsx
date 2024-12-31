import {
	Pressable,
	RefreshControl,
	ScrollView,
	StyleProp,
	StyleSheet,
	Text,
	View,
	ViewStyle,
} from 'react-native';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_FONTS } from '../../styles/AppFonts';
import SoftwareHeader from '../../screens/accounts/fragments/SoftwareHeader';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { AppIcon } from '../lib/Icon';
import { router } from 'expo-router';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../shared/topnavbar/AppTabLandingNavbar';
import { useState } from 'react';
import { AccountService } from '../../database/entities/account';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../utils/theming.util';
import {
	useAppAcct,
	useAppTheme,
} from '../../hooks/utility/global-state-extractors';

/**
 * This UI fragment can be shared with other
 * screens (that might have a different header,
 * footer or page decorations)
 * @constructor
 */
export function DriverSelectionFragment() {
	const { theme } = useAppTheme();
	const options: {
		label: string;
		padding: number;
		rightComponent: any;
		to: string;
	}[] = [
		{
			label: 'Bluesky (⛔, 🚧)',
			padding: 0,
			rightComponent: (
				<SoftwareHeader
					software={KNOWN_SOFTWARE.BLUESKY}
					mb={0}
					mt={0}
					iconSizeMultiplier={3}
				/>
			),
			to: '/profile/onboard/signin-bsky',
		},
		{
			label: 'Mastodon',
			padding: 24,
			rightComponent: (
				<View style={{ flexDirection: 'row' }}>
					<View style={{ paddingHorizontal: 4 }}>
						<SoftwareHeader
							software={KNOWN_SOFTWARE.MASTODON}
							mb={0}
							mt={0}
							iconSizeMultiplier={2}
						/>
					</View>
					<SoftwareHeader
						software={KNOWN_SOFTWARE.PLEROMA}
						mb={0}
						mt={0}
						iconSizeMultiplier={2}
					/>
					<SoftwareHeader
						software={KNOWN_SOFTWARE.AKKOMA}
						mb={0}
						mt={0}
						iconSizeMultiplier={2}
					/>
				</View>
			),
			to: '/profile/onboard/add-mastodon',
		},
		{
			label: 'Misskey',
			padding: 20,
			rightComponent: (
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<View style={{}}>
						<SoftwareHeader
							software={KNOWN_SOFTWARE.MISSKEY}
							mb={0}
							mt={0}
							iconSizeMultiplier={2}
						/>
					</View>

					<SoftwareHeader
						software={KNOWN_SOFTWARE.SHARKEY}
						mb={0}
						mt={0}
						iconSizeMultiplier={1.75}
					/>
					<SoftwareHeader
						software={KNOWN_SOFTWARE.FIREFISH}
						mb={0}
						mt={0}
						iconSizeMultiplier={1.5}
					/>
				</View>
			),
			to: '/profile/onboard/add-misskey',
		},
	];

	return (
		<View>
			{options.map((option, i) => (
				<Pressable
					key={i}
					style={[
						styles.selectSnsBox,
						{
							backgroundColor: theme.palette.menubar,
							paddingVertical: option.padding,
						},
					]}
					onPress={() => {
						router.push(option.to);
					}}
				>
					<Text
						style={[
							styles.selectSnsLabel,
							{
								color: theme.textColor.high,
								flex: 1,
							},
						]}
					>
						{option.label}
					</Text>
					{option.rightComponent}
				</Pressable>
			))}
		</View>
	);
}

type AddAccountLandingFragmentProps = {
	containerStyle?: StyleProp<ViewStyle>;
};

/**
 * This UI fragment can be shared with other
 * screens (that might have a different header,
 * but share footer or page decorations)
 * @constructor
 */
export function AddAccountLandingFragment({
	containerStyle,
}: AddAccountLandingFragmentProps) {
	const { theme } = useAppTheme();
	return (
		<View style={containerStyle}>
			<Text
				style={[
					styles.noAccountText,
					{
						color: theme.textColor.medium,
					},
				]}
			>
				Add Account
			</Text>
			<DriverSelectionFragment />

			<View style={styles.tipContainer}>
				<AppIcon
					id={'info'}
					size={24}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}
				/>
				<Text
					style={[
						styles.tipText,
						{
							color: theme.secondary.a30,
						},
					]}
				>
					Account creation is not supported.
				</Text>
			</View>
		</View>
	);
}

/**
 * A full screen cover when no account is selected
 * @constructor
 */

type AppNoAccountProps = {
	tab: APP_LANDING_PAGE_TYPE;
};

function AppNoAccount({ tab }: AppNoAccountProps) {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { theme } = useAppTheme();
	const { acct } = useAppAcct();
	const { db, loadApp } = useGlobalState(
		useShallow((o) => ({
			db: o.db,
			loadApp: o.loadApp,
		})),
	);

	function onRefresh() {
		setIsRefreshing(true);
		try {
			// possibly locked because of added/deleted account
			if (!acct) {
				AccountService.ensureAccountSelection(db);
				loadApp();
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
			<AddAccountLandingFragment />
		</ScrollView>
	);
}

export default AppNoAccount;

const styles = StyleSheet.create({
	noAccountText: {
		fontSize: 24,
		textAlign: 'center',
		marginTop: 48,
		fontFamily: APP_FONTS.INTER_700_BOLD,
		marginBottom: 32,
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
		padding: 6,
		fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
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
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		marginLeft: 6,
	},
});
