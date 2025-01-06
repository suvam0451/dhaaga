import {
	Animated,
	FlatList,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import ProfileLandingAccountOverview from './landing/fragments/ProfileLandingAccountOverview';
import ProfileLandingAccountModules from './landing/fragments/ProfileLandingAccountModules';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { APP_FONTS } from '../../../../styles/AppFonts';
import AppNoAccount from '../../../error-screen/AppNoAccount';
import { APP_LANDING_PAGE_TYPE } from '../../../shared/topnavbar/AppTabLandingNavbar';
import {
	useAppAcct,
	useAppTheme,
} from '../../../../hooks/utility/global-state-extractors';
import { APP_ICON_ENUM, AppIcon } from '../../../lib/Icon';
import { appDimensions } from '../../../../styles/dimensions';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../utils/theming.util';
import { AppText } from '../../../lib/Text';
import { APP_ROUTING_ENUM } from '../../../../utils/route-list';
import { router } from 'expo-router';

type AppModulesProps = {
	label: string;
	desc: string;
	iconId: APP_ICON_ENUM;
	to: APP_ROUTING_ENUM;
};

function AppModules({ label, desc, iconId, to }: AppModulesProps) {
	const { theme } = useAppTheme();

	return (
		<View style={styles.appModuleContainer}>
			<Pressable
				style={[
					styles.appModuleContent,
					{
						backgroundColor: '#242424', // '#282828',
					},
				]}
				onPress={() => {
					router.navigate(to);
				}}
			>
				<View style={styles.tiltedIconContainer}>
					<AppIcon
						id={iconId}
						size={appDimensions.socialHub.feeds.tiltedIconSize}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						iconStyle={{ color: theme.secondary.a0 }}
					/>
				</View>
				<AppText.H6 emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}>
					{label}
				</AppText.H6>
				<AppText.Medium
					style={{
						width: 96,
						color: theme.complementary.a0,
					}}
					numberOfLines={1}
				>
					{desc}
				</AppText.Medium>
			</Pressable>
		</View>
	);
}

type HeaderProps = {
	label: string;
};

function Header({ label }: HeaderProps) {
	const { theme } = useAppTheme();
	return (
		<View
			style={{
				paddingHorizontal: 12,
				paddingVertical: 16,
			}}
		>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					width: '100%',
				}}
			>
				<View style={{ flexGrow: 1, flex: 1 }}>
					<Text style={[styles.headerText, { color: theme.textColor.high }]}>
						{label}
					</Text>
				</View>

				<View
					style={{ padding: 4, marginLeft: 4, transform: [{ translateX: -1 }] }}
				>
					<MaterialIcons
						name="notes"
						size={24}
						color={theme.textColor.high}
						style={{ transform: [{ scaleX: -1 }] }}
					/>
				</View>
			</View>
		</View>
	);
}

function MyAccountPage() {
	const { onScroll } = useScrollMoreOnPageEnd();
	const { theme } = useAppTheme();
	const { acct } = useAppAcct();

	if (!acct) return <AppNoAccount tab={APP_LANDING_PAGE_TYPE.PROFILE} />;

	const appModules: AppModulesProps[] = [
		{
			label: 'Profiles',
			desc: 'More hub tabs!',
			iconId: 'layers-outline',
			to: APP_ROUTING_ENUM.PROFILES,
		},
		{
			label: 'Collections',
			desc: 'bookmark++',
			iconId: 'layers-outline',
			to: APP_ROUTING_ENUM.PROFILES,
		},
	];

	return (
		<View style={{ backgroundColor: theme.palette.bg, height: '100%' }}>
			<Animated.ScrollView onScroll={onScroll}>
				<Header label={'My Account'} />
				<ProfileLandingAccountOverview />
				<ProfileLandingAccountModules />
				<FlatList
					data={appModules}
					numColumns={2}
					renderItem={({ item }) => (
						<AppModules
							desc={item.desc}
							label={item.label}
							iconId={item.iconId}
							to={item.to}
						/>
					)}
					style={{
						marginHorizontal: 8,
					}}
				/>
			</Animated.ScrollView>
		</View>
	);
}

export default MyAccountPage;

const styles = StyleSheet.create({
	headerText: {
		fontSize: 28,
		fontFamily: APP_FONTS.INTER_700_BOLD,
	},
	appModuleContainer: {
		maxWidth: '50%',
		flex: 1,
		paddingHorizontal: 6,
	},
	appModuleContent: {
		paddingVertical: 10,
		paddingHorizontal: 12, // marginHorizontal: 8,
		borderRadius: 8,
		marginBottom: 12,

		overflow: 'hidden',
		width: 'auto',
	},
	tiltedIconContainer: {
		transform: [{ rotateZ: '-15deg' }],
		width: 42,
		position: 'absolute',
		opacity: 0.48,
		right: 0,
		bottom: -6,
	},
});
