import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import useScrollMoreOnPageEnd from '../../../../../states/useScrollMoreOnPageEnd';
import ProfileLandingAccountOverview from './fragments/ProfileLandingAccountOverview';
import ProfileLandingAccountModules from './fragments/ProfileLandingAccountModules';
import useGlobalState from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { useAppTheme } from '../../../../../hooks/app/useAppThemePack';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';

type HeaderProps = {
	label: string;
};

function Header({ label }: HeaderProps) {
	const { colorScheme } = useAppTheme();

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
					<Text
						style={[styles.headerText, { color: colorScheme.textColor.high }]}
					>
						{label}
					</Text>
				</View>

				<Pressable style={{ padding: 4 }} onPress={() => {}}>
					<AntDesign name="user" size={24} color={colorScheme.textColor.high} />
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
						color={colorScheme.textColor.high}
					/>
				</Pressable>

				<View
					style={{ padding: 4, marginLeft: 4, transform: [{ translateX: -1 }] }}
				>
					<MaterialIcons
						name="notes"
						size={24}
						color={colorScheme.textColor.high}
						style={{ transform: [{ scaleX: -1 }] }}
					/>
				</View>
			</View>
		</View>
	);
}

function AccountLanding() {
	const { onScroll } = useScrollMoreOnPageEnd();

	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

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
