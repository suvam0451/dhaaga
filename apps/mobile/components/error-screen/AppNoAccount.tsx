import {
	Pressable,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_FONTS } from '../../styles/AppFonts';
import SoftwareHeader from '../../screens/accounts/fragments/SoftwareHeader';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import { AppIcon } from '../lib/Icon';
import { router } from 'expo-router';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../shared/topnavbar/AppTabLandingNavbar';
import { useState } from 'react';
import { AccountService } from '../../database/entities/account';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../utils/theming.util';

/**
 * A full screen cover when no account is selected
 * @constructor
 */

type AppNoAccountProps = {
	tab: APP_LANDING_PAGE_TYPE;
};

function AppNoAccount({ tab }: AppNoAccountProps) {
	const [IsRefreshing, setIsRefreshing] = useState(false);

	const { theme, db, acct, loadApp } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
			db: o.db,
			acct: o.acct,
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

	const options: {
		label: string;
		padding: number;
		rightComponent: any;
		to: string;
	}[] = [
		{
			label: 'Bluesky',
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

			<View>
				<View style={{ flexGrow: 1 }}>
					<Text
						style={[
							styles.noAccountText,
							{
								color: theme.textColor.medium,
							},
						]}
					>
						Add an Account
					</Text>
					{options.map((option, i) => (
						<Pressable
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

				<View
					style={{
						alignItems: 'center',
						flexDirection: 'row',
						justifyContent: 'center',
						width: '100%',
						marginTop: 32,
					}}
				>
					<AppIcon
						id={'info'}
						containerStyle={{
							width: 24,
							marginRight: 6,
						}}
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
	tipText: {},
});