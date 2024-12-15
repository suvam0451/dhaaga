import { memo, useEffect } from 'react';
import {
	Dimensions,
	LayoutChangeEvent,
	Pressable,
	StyleSheet,
	View,
} from 'react-native';
import Animated, {
	measure,
	MeasuredDimensions,
	runOnJS,
	runOnUI,
	useAnimatedRef,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { APP_FONTS } from '../../styles/AppFonts';
import { useAppTheme } from '../../hooks/app/useAppThemePack';

type ChipProps = {
	active: boolean;
	label: string;
	onLayout: (event: LayoutChangeEvent) => void;
	onPress: (measurement: MeasuredDimensions | null) => void;
};

const Chip = memo(({ active, label, onLayout, onPress }: ChipProps) => {
	const { colorScheme } = useAppTheme();
	const ref = useAnimatedRef<Animated.View>();

	// respond to page changes via swipe gesture
	useEffect(() => {
		if (!active) return;
		onSelect();
	}, [active]);

	const onSelect = () => {
		runOnUI(() => {
			const measurement = measure(ref);
			runOnJS(onPress)(measurement);
		})();
	};
	const animStyle = useAnimatedStyle(() => {
		return {
			color: withTiming(
				active ? colorScheme.textColor.high : colorScheme.textColor.medium,
				{
					duration: 350,
				},
			),
		};
	});
	return (
		<Pressable onLayout={onLayout} ref={ref} onPress={onSelect}>
			<Animated.Text style={[styles.label, animStyle]}>{label}</Animated.Text>
		</Pressable>
	);
});

export const SCREEN_WIDTH = Dimensions.get('window').width;
const INDICATOR_PADDING = 16;
const TAB_BAR_WIDTH = SCREEN_WIDTH - 16;
const SIDE_PADDING = (SCREEN_WIDTH - TAB_BAR_WIDTH) / 2;
const ANIMATION_DURATION = 300;

type SingleSelectAnimatedProps = {
	justify:
		| 'flex-start'
		| 'flex-end'
		| 'center'
		| 'space-between'
		| 'space-around'
		| 'space-evenly'
		| undefined;
	items: {
		label: string;
		id: string;
	}[];
	Index: number;
	setIndex: (idx: number) => void;
};

/**
 * Allows selection of a single item
 * from list. The transition is animated.
 *
 * Very similar to apple's UI design
 *
 * @param justify use space-between for
 * full width and flex-start for left aligned
 */
export const SingleSelectAnimated = memo(
	({ items, justify, Index, setIndex }: SingleSelectAnimatedProps) => {
		const xPos = useSharedValue(0);
		const xWidth = useSharedValue(0);

		useEffect(() => {
			onSelect(Index);
		}, [Index]);

		const onSelect = (index: number, dims?: any) => {
			setIndex(index);

			if (dims) {
				const adjustedXPosition =
					dims.pageX - INDICATOR_PADDING / 2 - SIDE_PADDING;
				xPos.value = withTiming(adjustedXPosition, {
					duration: ANIMATION_DURATION,
				});
				xWidth.value = withTiming(dims.width + INDICATOR_PADDING, {
					duration: ANIMATION_DURATION,
				});
			}
		};

		const handleLayout = (index: number, event: any) => {
			if (index === 0) {
				const layout = event.nativeEvent.layout;
				xPos.value = layout.x - INDICATOR_PADDING / 2;
				xWidth.value = layout.width + INDICATOR_PADDING;
			}
		};

		const indicatorAnimatedStyle = useAnimatedStyle(() => {
			return {
				width: xWidth.value,
				transform: [{ translateX: xPos.value }],
			};
		});

		const { colorScheme } = useAppTheme();
		return (
			<View style={styles.root}>
				<View style={[styles.container, { justifyContent: justify }]}>
					{items.map((o, i) => (
						<Chip
							key={i}
							active={Index === i}
							label={o.label}
							onPress={(e) => onSelect(i, e)}
							onLayout={(e) => handleLayout(i, e)}
						/>
					))}
					<Animated.View
						style={[
							styles.indicator,
							{ backgroundColor: colorScheme.palette.buttonUnstyled },
							indicatorAnimatedStyle,
						]}
					/>
				</View>
			</View>
		);
	},
);

const styles = StyleSheet.create({
	root: {
		alignItems: 'center',
		backgroundColor: 'transparent',
	},
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingVertical: 12,
		borderRadius: 20,
		width: TAB_BAR_WIDTH,
	},
	indicator: {
		position: 'absolute',
		backgroundColor: '#242424',
		height: 32,
		borderRadius: 16,
		zIndex: -1,
	},
	label: {
		fontWeight: '500',
		fontSize: 16,
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
	},
});
