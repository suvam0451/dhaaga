import APP_ICON_ENUM, { AppIcon } from '#/components/lib/Icon';
import {
	StyleProp,
	TouchableOpacity,
	View,
	ViewStyle,
	StyleSheet,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useAppTheme } from '#/states/global/hooks';

const TAB_BAR_HEIGHT = 56;
const ICON_SIZE = 32;

const TABS = [
	'megaphone-outline',
	'chatbubbles-outline',
	'gallery',
	'grid-outline',
];

type Props = {
	changeTabIndex: (index: number) => void;
	TabIndex: number;
	animatedStyle: StyleProp<ViewStyle>;
};

function UserProfilePagerWidget({
	TabIndex,
	changeTabIndex,
	animatedStyle,
}: Props) {
	const { theme } = useAppTheme();
	const ACTIVE_TINT = theme.primary;
	const INACTIVE_TINT = theme.secondary.a30;

	return (
		<Animated.View
			style={[
				styles.root,
				{
					backgroundColor: theme.background.a20,
				},
				animatedStyle,
			]}
		>
			{TABS.map((tab, index) => (
				<TouchableOpacity
					key={index}
					style={styles.buttonContainer}
					onPress={() => changeTabIndex(index)}
				>
					<AppIcon
						id={tab as APP_ICON_ENUM}
						size={ICON_SIZE}
						color={TabIndex === index ? ACTIVE_TINT : INACTIVE_TINT}
						onPress={() => changeTabIndex(index)}
					/>
					<View
						style={[
							styles.activeIndicator,
							{
								backgroundColor:
									TabIndex === index ? ACTIVE_TINT : 'transparent',
							},
						]}
					/>
				</TouchableOpacity>
			))}
		</Animated.View>
	);
}

export default UserProfilePagerWidget;

const styles = StyleSheet.create({
	root: {
		height: TAB_BAR_HEIGHT,
		width: '100%',
		flexDirection: 'row',
		borderBottomWidth: 1,
		zIndex: 20,
	},
	buttonContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 16,
		zIndex: 200,
	},
	activeIndicator: {
		width: 64,
		height: 3,
		marginTop: 8,
		borderRadius: 16,
	},
});
