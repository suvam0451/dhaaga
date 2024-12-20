import { Pressable, StyleSheet, Text, View } from 'react-native';
import { APP_FONTS } from '../../../styles/AppFonts';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_ICON_ENUM, AppIcon } from '../../lib/Icon';

export enum APP_LANDING_PAGE_TYPE {
	HOME,
	DISCOVER,
	COMPOSE,
	INBOX,
	PROFILE,
}

type AppTabLandingNavbarProps = {
	type: APP_LANDING_PAGE_TYPE;
	menuItems: {
		iconId: APP_ICON_ENUM;
		onPress?: () => void;
		disabled?: boolean;
	}[];
};

const navbarLabel: Record<APP_LANDING_PAGE_TYPE, string> = {
	[APP_LANDING_PAGE_TYPE.HOME]: 'Social Hub',
	[APP_LANDING_PAGE_TYPE.DISCOVER]: 'Discover',
	[APP_LANDING_PAGE_TYPE.COMPOSE]: 'Compose',
	[APP_LANDING_PAGE_TYPE.INBOX]: 'Inbox',
	[APP_LANDING_PAGE_TYPE.PROFILE]: 'App Profile',
};

/**
 * This navbar is expected on the
 * landing pages for each of the five
 * main routes
 */
function AppTabLandingNavbar({ type, menuItems }: AppTabLandingNavbarProps) {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

	return (
		<View style={styles.container}>
			<View style={{ flexGrow: 1 }}>
				<Text style={[styles.headerText, { color: theme.textColor.high }]}>
					{navbarLabel[type]}
				</Text>
			</View>
			<View style={{ flexDirection: 'row' }}>
				{menuItems.map(({ iconId, disabled, onPress }, i) => (
					<Pressable
						key={i}
						style={{ padding: 4, marginLeft: 4 }}
						onPress={onPress}
					>
						<AppIcon id={iconId} emphasis={disabled ? 'low' : 'high'} />
					</Pressable>
				))}
			</View>
		</View>
	);
}

export default AppTabLandingNavbar;

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 12,
		paddingVertical: 16,
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
	},
	headerText: {
		fontSize: 28,
		fontFamily: APP_FONTS.INTER_700_BOLD,
	},
});
