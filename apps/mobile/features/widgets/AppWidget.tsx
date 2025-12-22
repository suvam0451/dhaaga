import { useAppDialog, useAppTheme } from '#/states/global/hooks';
import { ReactNode, useState } from 'react';
import { Dimensions, Pressable, View, StyleSheet } from 'react-native';
import Animated, {
	useAnimatedStyle,
	withTiming,
} from 'react-native-reanimated';
import { appDimensions } from '#/styles/dimensions';
import { AppIcon } from '#/components/lib/Icon';
import { HapticsUtils } from '#/utils/haptics';

const WIDGET_MIN_WIDTH = 52;

type Props = {
	isOpen: boolean;
	/**
	 * Draws on top when the
	 * widget is expanded
	 */
	ForegroundSlot: ReactNode;
	/**
	 * Appears when the widget
	 * is collapsed
	 */
	BackgroundSlot: ReactNode;

	inactiveIcon: string;
	activeIcon: string;

	onWidgetPress: () => void;
};

function AppWidget({
	isOpen,
	BackgroundSlot,
	ForegroundSlot,
	inactiveIcon,
	activeIcon,
	onWidgetPress,
}: Props) {
	const { theme } = useAppTheme();
	const { show } = useAppDialog();

	// Alignment
	const [Alignment, setAlignment] = useState<'left' | 'right'>('right');
	// Dimensions
	const MAX_WIDTH = Dimensions.get('window').width;
	// Derived Styles
	const BORDER_TOP_START_RADIUS_CLOSED = Alignment === 'left' ? 6 : 16;
	const BORDER_TOP_END_RADIUS_CLOSED = Alignment === 'left' ? 16 : 6;
	const BORDER_BOTTOM_START_RADIUS_CLOSED = Alignment === 'left' ? 6 : 16;
	const BORDER_BOTTOM_END_RADIUS_CLOSED = Alignment === 'left' ? 16 : 6;

	async function onLeftAlign() {
		setAlignment('left');
	}

	async function onRightAlign() {
		setAlignment('right');
	}

	function onWidgetLongPress() {
		HapticsUtils.medium();
		// show({
		// 	title: 'Widget Alignment',
		// 	description: ['Where do you want the widget?'],
		// 	actions: [
		// 		{
		// 			label: 'Left',
		// 			onPress: onLeftAlign,
		// 		},
		// 		{
		// 			label: 'Right',
		// 			onPress: onRightAlign,
		// 		},
		// 	],
		// });
	}

	/**
	 * Animations
	 */

	const widgetStyle = useAnimatedStyle(() => {
		return {
			width: withTiming(isOpen ? MAX_WIDTH : WIDGET_MIN_WIDTH, {
				duration: 200,
			}),
			borderTopStartRadius: isOpen ? 6 : BORDER_TOP_START_RADIUS_CLOSED,
			borderTopEndRadius: isOpen ? 6 : BORDER_TOP_END_RADIUS_CLOSED,
			borderBottomStartRadius: isOpen ? 6 : BORDER_BOTTOM_START_RADIUS_CLOSED,
			borderBottomEndRadius: isOpen ? 6 : BORDER_BOTTOM_END_RADIUS_CLOSED,
		};
	});

	return (
		<>
			<View style={{ display: isOpen ? 'none' : 'flex' }}>
				{BackgroundSlot}
			</View>
			<Animated.View
				style={[
					{
						position: 'absolute',
						zIndex: 10,
						bottom: 0,
						right: 0,
						height: appDimensions.bottomNav.secondMenuBarHeight,
						backgroundColor: theme.primary,
						flexDirection: 'row',
					},
					widgetStyle,
				]}
			>
				<View
					style={{
						flex: 1,
						alignItems: 'center',
						display: isOpen ? 'flex' : 'none',
						marginRight: 72,
					}}
				>
					{ForegroundSlot}
				</View>
				<Pressable
					onPress={onWidgetPress}
					onLongPress={onWidgetLongPress}
					style={[styles.triggerIcon]}
				>
					<AppIcon
						id={isOpen ? activeIcon : (inactiveIcon as any)}
						color={theme.primaryText}
					/>
				</Pressable>
			</Animated.View>
		</>
	);
}

export default AppWidget;

const styles = StyleSheet.create({
	triggerIcon: {
		paddingVertical: 12,
		alignItems: 'center',
		marginVertical: 'auto',
		height: appDimensions.bottomNav.secondMenuBarHeight,
		width: WIDGET_MIN_WIDTH,
		maxWidth: WIDGET_MIN_WIDTH,
		flexShrink: 1,
		position: 'absolute',
		right: 0,
		bottom: 0,
		zIndex: 20,
	},
});
