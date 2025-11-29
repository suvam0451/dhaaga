import { ReactElement, useEffect, useRef, useState } from 'react';
import PagerView from 'react-native-pager-view';
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
import { useAppTheme } from '../hooks/utility/global-state-extractors';
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
import { LinearGradient } from 'expo-linear-gradient';
import { APP_FONTS } from '../styles/AppFonts';

const SCREEN_WIDTH = Dimensions.get('window').width;
const INDICATOR_PADDING = 16;
const TAB_BAR_WIDTH = SCREEN_WIDTH - 16;
const SIDE_PADDING = (SCREEN_WIDTH - TAB_BAR_WIDTH) / 2;
const ANIMATION_DURATION = 50;

type SingleSelectAnimatedProps = {
	items: {
		label: string;
		id: string;
	}[];
	Index: number;
	setIndex: (idx: number) => void;
};

type ChipProps = {
	active: boolean;
	label: string;
	onLayout: (event: LayoutChangeEvent) => void;
	onPress: (measurement: MeasuredDimensions | null) => void;
};

function Chip({ active, label, onLayout, onPress }: ChipProps) {
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
			color: withTiming(active ? theme.primary.a0 : theme.secondary.a30, {
				duration: ANIMATION_DURATION,
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
			<Animated.Text
				style={[
					styles.label,
					{
						fontFamily: active
							? APP_FONTS.INTER_500_MEDIUM
							: APP_FONTS.INTER_500_MEDIUM,
					},
					animStyle,
				]}
			>
				{label}
			</Animated.Text>
		</Pressable>
	);
}

/**
 * Allows selection of a single item
 * from list. The transition is animated.
 */
function NavBar({ items, Index, setIndex }: SingleSelectAnimatedProps) {
	const { theme } = useAppTheme();

	// unused
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

	function handleLayout(index: number, event: any) {
		if (index === 0) {
			const layout = event.nativeEvent.layout;
			xPos.value = layout.x - INDICATOR_PADDING / 2;
			xWidth.value = layout.width + INDICATOR_PADDING;
		}
	}

	return (
		<LinearGradient
			colors={['transparent', theme.palette.bg]}
			style={styles.navbarRoot}
		>
			<FlatList
				data={items}
				horizontal={true}
				renderItem={({ item: o, index: i }) => (
					<Chip
						active={Index === i}
						label={o.label}
						onPress={(e) => onSelect(i, e)}
						onLayout={(e) => handleLayout(i, e)}
					/>
				)}
			/>
		</LinearGradient>
	);
}

type AppPagerViewProps = {
	tabCount: number;
	renderScene: (index: number) => ReactElement;
	labels: { label: string; id: string }[] /**
	 * whether the floating bottom navbar should be shown
	 * for this PagerView
	 */;
	showBottomNav?: boolean;
	props?: StyleProp<ViewStyle>;
};

function AppPagerView({
	tabCount,
	renderScene,
	labels,
	showBottomNav,
	props,
}: AppPagerViewProps) {
	const [TabIndex, setTabIndex] = useState(0);
	const ref = useRef<PagerView>(null);

	function onPagerViewScroll(e: any) {
		const { offset, position } = e.nativeEvent;
		const nextIdx = Math.round(position + offset);
		setTabIndex(nextIdx);
	}

	function onChipSelected(index: number) {
		if (TabIndex !== index) {
			ref.current.setPage(index);
		}
	}

	return (
		<View style={[{ flex: 1, position: 'relative' }, props]}>
			<PagerView
				ref={ref}
				scrollEnabled={true}
				style={{ flex: 1 }}
				initialPage={TabIndex}
				onPageScroll={onPagerViewScroll}
				collapsable={false}
			>
				{Array.from({ length: tabCount }).map((_, index) => (
					<View key={index} style={{ flex: 1 }}>
						{renderScene(index)}
					</View>
				))}
			</PagerView>
			{showBottomNav && (
				<NavBar Index={TabIndex} setIndex={onChipSelected} items={labels} />
			)}
		</View>
	);
}

export { AppPagerView };

const styles = StyleSheet.create({
	navbarRoot: {
		paddingTop: 42, // for smooth transparency effect
		flex: 1,
		backgroundColor: 'transparent',
		position: 'absolute',
		bottom: 8,
		width: '100%',
	},
	label: {
		textAlign: 'center',
		marginLeft: 'auto',
		fontSize: 18,
	},
	chip: {
		paddingVertical: 6,
		flex: 1,
		paddingHorizontal: 12,
	},
});
