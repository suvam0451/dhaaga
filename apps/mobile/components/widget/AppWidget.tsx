import { useAppTheme } from '#/states/global/hooks';
import { ReactNode, useState } from 'react';
import {
	Animated,
	Dimensions,
	Pressable,
	View,
	StyleSheet,
} from 'react-native';
import { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { appDimensions } from '#/styles/dimensions';
import { AppIcon } from '#/components/lib/Icon';

const WIDGET_MIN_WIDTH = 52;

type Props = {
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
};

function AppWidget({
	BackgroundSlot,
	ForegroundSlot,
	inactiveIcon,
	activeIcon,
}: Props) {
	const [WidgetOpen, setWidgetOpen] = useState(false);
	const { theme } = useAppTheme();

	// Alignment
	const [Alignment, setAlignment] = useState<'left' | 'right'>('right');
	// Dimensions
	const MAX_WIDTH = Dimensions.get('window').width;
	// Derived Styles
	const BORDER_TOP_START_RADIUS_CLOSED = Alignment === 'left' ? 8 : 16;
	const BORDER_TOP_END_RADIUS_CLOSED = Alignment === 'left' ? 16 : 8;
	const BORDER_BOTTOM_START_RADIUS_CLOSED = Alignment === 'left' ? 8 : 16;
	const BORDER_BOTTOM_END_RADIUS_CLOSED = Alignment === 'left' ? 16 : 8;

	function onPress() {
		setWidgetOpen((o) => !o);
	}

	/**
	 * Animations
	 */

	const widgetStyle = useAnimatedStyle(() => {
		return {
			width: withTiming(WidgetOpen ? MAX_WIDTH : WIDGET_MIN_WIDTH, {
				duration: 200,
			}),
			borderTopStartRadius: WidgetOpen ? 8 : BORDER_TOP_START_RADIUS_CLOSED,
			borderTopEndRadius: WidgetOpen ? 8 : BORDER_TOP_END_RADIUS_CLOSED,
			borderBottomStartRadius: WidgetOpen
				? 8
				: BORDER_BOTTOM_START_RADIUS_CLOSED,
			borderBottomEndRadius: WidgetOpen ? 8 : BORDER_BOTTOM_END_RADIUS_CLOSED,
		};
	});

	return (
		<View>
			{BackgroundSlot}
			<Animated.View
				style={[
					{
						width: 72,
						position: 'absolute',
						zIndex: 1000000000,
						bottom: 0,
						right: 0,
						height: appDimensions.bottomNav.secondMenuBarHeight,
						backgroundColor: theme.background.a10,
						flexDirection: 'row',
					},
					widgetStyle,
				]}
			>
				<View style={{ flex: 1, alignItems: 'center' }}>
					{WidgetOpen ? ForegroundSlot : <View />}
				</View>
				<Pressable
					onPress={onPress}
					style={[
						styles.triggerIcon,
						{
							backgroundColor: theme.primary,
						},
					]}
				>
					<AppIcon
						id={WidgetOpen ? activeIcon : (inactiveIcon as any)}
						color={'black'}
					/>
				</Pressable>
			</Animated.View>
		</View>
	);
}

export default AppWidget;

const styles = StyleSheet.create({
	triggerIcon: {
		paddingVertical: 12,
		paddingHorizontal: 12,
	},
});
