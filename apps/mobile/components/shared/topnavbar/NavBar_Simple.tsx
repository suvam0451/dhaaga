import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { appDimensions } from '#/styles/dimensions';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import TopNavbarBackButton from '#/components/shared/topnavbar/fragments/TopNavbarBackButton';
import { AppText } from '#/components/lib/Text';
import Animated from 'react-native-reanimated';

type Props = {
	label: string;
	menu?: { iconId: string; onPress: () => void }[];
	animatedStyle?: StyleProp<ViewStyle>;
};

/**
 * Simple navigation bar which
 * can
 *
 * - show a label
 * - has a back button on left
 * - can have an array of buttons on right
 * - (optionally) auto-hides on content scroll
 * @constructor
 */
function NavBar_Simple({ label, animatedStyle }: Props) {
	const { theme } = useAppTheme();

	return (
		<Animated.View
			style={[
				{
					position: 'absolute',
					zIndex: 1,
				},
				animatedStyle,
			]}
		>
			<View
				style={[styles.subHeader, { backgroundColor: theme.background.a10 }]}
			>
				<TopNavbarBackButton />
				<View style={styles.navbarTitleContainer}>
					<AppText.SemiBold
						style={{
							fontSize: 18,
							color: theme.secondary.a10,
						}}
					>
						{label}
					</AppText.SemiBold>
				</View>
				<View style={{ width: 36 }}></View>
			</View>
		</Animated.View>
	);
}

export default NavBar_Simple;

const styles = StyleSheet.create({
	subHeader: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: appDimensions.topNavbar.height,
	},
	navbarTitleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	navbarTitle: {
		fontSize: 16,
	},
});
