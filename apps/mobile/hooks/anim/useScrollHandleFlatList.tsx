import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import {
	clamp,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const END_OF_CONTAINER_SCROLL_THRESHOLD = 40;
/**
 * Automatically hides the top nav bar when scrolling down
 * and shows it when scrolling up.
 * @param height
 * @param onEndReached
 */
function useHideNavUsingFlatList(
	onEndReached: () => void = () => {},
	height: number = 52,
) {
	const prevScrollY = useSharedValue(0);

	// 0 = visible, -NAVBAR_HEIGHT = hidden
	const navbarOffset = useSharedValue(0);

	function scrollHandler(eventObject: NativeSyntheticEvent<NativeScrollEvent>) {
		const event = eventObject.nativeEvent;
		/**
		 * handle reaching the bottom of the container
		 */
		const { layoutMeasurement, contentOffset, contentSize } = event;
		if (
			layoutMeasurement.height + contentOffset.y >=
			contentSize.height - END_OF_CONTAINER_SCROLL_THRESHOLD
		) {
			scheduleOnRN(onEndReached);
		}

		const y = event.contentOffset.y;
		const diff = y - prevScrollY.value;
		if (diff > 0) {
			// swiping up, scrolling down → hide
			const nextValue = navbarOffset.value - diff / 2;
			if (nextValue < -height / 2) {
				navbarOffset.value = withTiming(-height, { duration: 180 });
			} else {
				navbarOffset.value = clamp(navbarOffset.value - diff / 2, -height, 0);
			}
		} else if (diff < 0) {
			// swiping down, scrolling up → show
			const nextValue = navbarOffset.value - diff / 2;
			if (nextValue > -height / 2) {
				navbarOffset.value = withTiming(0, { duration: 180 });
			} else {
				navbarOffset.value = clamp(navbarOffset.value - diff / 2, -height, 0); // withTiming(0, { duration: 180 });
			}
		}

		prevScrollY.value = y;
	}

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: navbarOffset.value,
				},
			],
		};
	});
	return { scrollHandler, animatedStyle };
}

export default useHideNavUsingFlatList;
