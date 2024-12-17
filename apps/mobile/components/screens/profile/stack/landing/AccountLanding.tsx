import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import useScrollMoreOnPageEnd from '../../../../../states/useScrollMoreOnPageEnd';
import ProfileLandingAccountOverview from './fragments/ProfileLandingAccountOverview';
import ProfileLandingAccountModules from './fragments/ProfileLandingAccountModules';
import useGlobalState from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import AppNoAccount from '../../../../error-screen/AppNoAccount';
import { APP_LANDING_PAGE_TYPE } from '../../../../shared/topnavbar/AppTabLandingNavbar';

type HeaderProps = {
	label: string;
};

function Header({ label }: HeaderProps) {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

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

				<Pressable style={{ padding: 4 }} onPress={() => {}}>
					<AntDesign name="user" size={24} color={theme.textColor.high} />
				</Pressable>

				<Pressable
					style={{ padding: 4, marginLeft: 4 }}
					onPress={() => {
						router.navigate('/profile/settings/app-settings');
					}}
				>
					<Ionicons
						name="settings-outline"
						size={24}
						color={theme.textColor.high}
					/>
				</Pressable>

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

function AccountLanding() {
	const { onScroll } = useScrollMoreOnPageEnd();

	const { theme, acct } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
			acct: o.acct,
		})),
	);

	if (!acct) return <AppNoAccount tab={APP_LANDING_PAGE_TYPE.PROFILE} />;

	return (
		<View style={{ backgroundColor: theme.palette.bg, height: '100%' }}>
			<Animated.ScrollView onScroll={onScroll}>
				<Header label={'App Profile'} />
				<ProfileLandingAccountOverview />
				<ProfileLandingAccountModules />
			</Animated.ScrollView>
		</View>
	);
}

export default AccountLanding;

const styles = StyleSheet.create({
	headerText: {
		fontSize: 28,
		fontFamily: APP_FONTS.INTER_700_BOLD,
	},
});
