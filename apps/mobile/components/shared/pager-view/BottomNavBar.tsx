import { memo, useEffect, useRef } from 'react';
import {
	Dimensions,
	FlatList,
	LayoutChangeEvent,
	Pressable,
	StyleProp,
	StyleSheet,
	View,
	ViewStyle,
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
import { APP_FONTS } from '../../../styles/AppFonts';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';

type ChipProps = {
	active: boolean;
	label: string;
	onLayout: (event: LayoutChangeEvent) => void;
	onPress: (measurement: MeasuredDimensions | null) => void;
};

type ChipInfiniteProps = {
	active: boolean;
	label: string;
	onLayout: (event: LayoutChangeEvent) => void;
	onPress: (measurement: MeasuredDimensions | null) => void;
	containerStyle?: StyleProp<ViewStyle>;
};

function ChipInfinite({
	active,
	label,
	onLayout,
	onPress,
	containerStyle,
}: ChipInfiniteProps) {
	const { theme } = useAppTheme();

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
			color: withTiming(active ? theme.primary.a0 : theme.textColor.medium, {
				duration: 350,
			}),
		};
	});
	return (
		<Pressable
			onLayout={onLayout}
			ref={ref}
			onPress={onSelect}
			style={containerStyle}
		>
			<Animated.Text style={[styles.label, animStyle]}>{label}</Animated.Text>
		</Pressable>
	);
}

const Chip = memo(({ active, label, onLayout, onPress }: ChipProps) => {
	const { theme } = useAppTheme();

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
			color: withTiming(active ? theme.primary.a0 : theme.textColor.medium, {
				duration: 350,
			}),
		};
	});
	return (
		<Pressable
			onLayout={onLayout}
			ref={ref}
			onPress={onSelect}
			style={styles.chip}
		>
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
export const BottomNavBar = memo(
	({ items, Index, setIndex }: SingleSelectAnimatedProps) => {
		const { theme } = useAppTheme();

		const xPos = useSharedValue(0);
		const xWidth = useSharedValue(0);

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

		useEffect(() => {
			onSelect(Index);
		}, [Index]);

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

		return (
			<LinearGradient
				colors={['transparent', theme.palette.bg]}
				style={styles.root}
			>
				<View style={[styles.container, { justifyContent: 'space-around' }]}>
					{items.map((o, i) => (
						<Chip
							key={i}
							active={Index === i}
							label={o.label}
							onPress={(e) => onSelect(i, e)}
							onLayout={(e) => handleLayout(i, e)}
						/>
					))}
					<Animated.View style={[styles.indicator, indicatorAnimatedStyle]} />
				</View>
			</LinearGradient>
		);
	},
);

export function BottomNavBarInfinite({
	items,
	Index,
	setIndex,
	loadNext,
	loadPrev,
}: SingleSelectAnimatedProps & {
	loadNext: () => void;
	loadPrev: () => void;
}) {
	const { theme } = useAppTheme();
	const ref = useRef<FlatList>(null);

	const xPos = useSharedValue(0);
	const xWidth = useSharedValue(0);

	const animated = (index: number, dims?: any) => {
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

	const onSelect = (index: number, dims?: any) => {
		setIndex(index);
		animated(index, dims);
	};

	/**
	 * NOTE: Animations might be a
	 * bit disorienting for the users
	 */
	useEffect(() => {
		// if (Index >= items.length) return;
		// ref.current.scrollToIndex({ index: Index, animated: false });
	}, [Index, items]);

	useEffect(() => {
		animated(Index + 1);
	}, [Index]);

	const handleLayout = (index: number, event: any) => {
		if (index === 0) {
			const layout = event.nativeEvent.layout;
			xPos.value = layout.x - INDICATOR_PADDING / 2;
			xWidth.value = layout.width + INDICATOR_PADDING;
		}
	};

	return (
		<LinearGradient
			colors={['transparent', theme.palette.bg]}
			style={styles.infiniteContainer}
		>
			<View style={{ flex: 1, flexDirection: 'row' }}>
				<View style={{ flex: 1, flexGrow: 1 }}>
					<FlatList
						data={items}
						showsHorizontalScrollIndicator={false}
						horizontal={true}
						style={[styles.root]}
						ref={ref}
						renderItem={({ item, index }) => (
							<View style={[styles.infiniteContainerChip]}>
								<ChipInfinite
									active={Index === index}
									label={item.label}
									onPress={(e) => onSelect(index, e)}
									onLayout={(e) => handleLayout(index, e)}
									containerStyle={{ paddingHorizontal: 8 }}
								/>
							</View>
						)}
						onScrollToIndexFailed={() => {
							console.log('[WARN]:scroll to index failed...');
						}}
					/>
				</View>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						paddingHorizontal: 8,
					}}
				>
					<Pressable
						style={{
							borderRadius: '100%',
							padding: 6,
						}}
						onPress={loadPrev}
					>
						<Ionicons
							name={'chevron-back-circle'}
							color={theme.primary.a0}
							size={32}
						/>
					</Pressable>
					<Pressable
						style={{
							borderRadius: '100%',
							padding: 2,
							marginRight: 10,
						}}
						onPress={loadNext}
					>
						<Ionicons
							name={'chevron-forward-circle'}
							color={theme.primary.a0}
							size={32}
						/>
					</Pressable>
				</View>
			</View>
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	root: {
		flexShrink: 1,
		backgroundColor: 'transparent',
		height: 48,
		position: 'absolute',
		bottom: 0,
	},
	infiniteContainer: {
		flexDirection: 'row',
		position: 'absolute',
		bottom: 0,
	},
	infiniteContainerChip: {
		paddingHorizontal: 6,
		paddingVertical: 12,
		borderRadius: 20, // width: TAB_BAR_WIDTH,
	},
	container: {
		flexDirection: 'row', // alignItems: 'center',
		borderRadius: 20, // width: TAB_BAR_WIDTH,
	},
	indicator: {
		position: 'absolute',
		backgroundColor: '#242424',
		height: 32,
		borderRadius: 16,
		zIndex: -1,
	},
	label: {
		// fontWeight: '500',
		fontSize: 18,
		fontFamily: APP_FONTS.MONTSERRAT_500_MEDIUM,
	},
	chip: {
		paddingVertical: 12,
		paddingHorizontal: 12,
	},
});
