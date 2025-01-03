import { Animated, StyleSheet, Text, View } from 'react-native';
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

	return (
		<View style={{ backgroundColor: theme.palette.bg, height: '100%' }}>
			<Animated.ScrollView onScroll={onScroll}>
				<Header label={'My Account'} />
				<ProfileLandingAccountOverview />
				<ProfileLandingAccountModules />
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
});
