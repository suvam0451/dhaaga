import {
	View,
	StyleSheet,
	ViewStyle,
	StyleProp,
	Pressable,
} from 'react-native';
import { appDimensions } from '#/styles/dimensions';
import { useAppTheme } from '#/states/global/hooks';
import Animated from 'react-native-reanimated';
import { NativeTextBold } from '#/ui/NativeText';
import { AppIcon } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { Link } from 'expo-router';

function BackNavigationButton() {
	return (
		<Link asChild style={styles.backButton} href="..">
			<Pressable>
				<AppIcon
					id={'back'}
					size={25}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
				/>
			</Pressable>
		</Link>
	);
}

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
 * - has a back button on the left
 * - can have an array of buttons on the right
 * - (optionally) auto-hides on the content scroll
 * @constructor
 */
function NavBar_Simple({ label, animatedStyle }: Props) {
	const { theme } = useAppTheme();

	return (
		<Animated.View style={[styles.root, animatedStyle]}>
			<View
				style={[styles.subHeader, { backgroundColor: theme.background.a10 }]}
			>
				<BackNavigationButton />
				<View style={styles.navbarTitleContainer}>
					<NativeTextBold
						style={{
							fontSize: 18,
							color: theme.secondary.a10,
						}}
					>
						{label}
					</NativeTextBold>
				</View>
				<View style={{ width: 36 }}></View>
			</View>
		</Animated.View>
	);
}

export default NavBar_Simple;

const styles = StyleSheet.create({
	root: {
		position: 'absolute',
		zIndex: 1,
	},
	subHeader: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: appDimensions.topNavbar.simpleVariantHeight,
	},
	navbarTitleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	navbarTitle: {
		fontSize: 16,
	},
	backButton: {
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'row',
		paddingHorizontal: 8,
	},
});
