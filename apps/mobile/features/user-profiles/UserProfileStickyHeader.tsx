import APP_ICON_ENUM, { AppIcon } from '#/components/lib/Icon';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useAppTheme } from '#/states/global/hooks';

const TAB_BAR_HEIGHT = 56;
const ICON_SIZE = 32;
// images-outline
const TABS = [
	'megaphone-outline',
	'chatbubbles-outline',
	'gallery',
	'grid-outline',
]; // grid-outline, apps-outline

type Props = {
	changeTabIndex: (index: number) => void;
	TabIndex: number;
	animatedStyle: StyleProp<ViewStyle>;
};

function UserProfileStickyHeader({
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
				{
					// position: 'absolute',
					height: TAB_BAR_HEIGHT,
					width: '100%',
					backgroundColor: '#181818',
					flexDirection: 'row',
					borderBottomWidth: 1,
					borderColor: '#333',
					zIndex: 20,
				},
				animatedStyle,
			]}
		>
			{TABS.map((tab, index) => (
				<TouchableOpacity
					key={index}
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						paddingTop: 16,
						zIndex: 200,
					}}
					onPress={() => changeTabIndex(index)}
				>
					<AppIcon
						id={tab as APP_ICON_ENUM}
						size={ICON_SIZE}
						color={TabIndex === index ? ACTIVE_TINT : INACTIVE_TINT}
						onPress={() => changeTabIndex(index)}
					/>
					<View
						style={{
							backgroundColor: TabIndex === index ? ACTIVE_TINT : 'transparent',
							width: 64,
							height: 3,
							marginTop: 8,
							borderRadius: 16,
						}}
					/>
				</TouchableOpacity>
			))}
		</Animated.View>
	);
}

export default UserProfileStickyHeader;
