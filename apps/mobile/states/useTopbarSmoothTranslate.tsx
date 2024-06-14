import { useRef } from 'react';
import { Animated, NativeSyntheticEvent } from 'react-native';
import diffClamp = Animated.diffClamp;

type Props = {
	onScrollJsFn?: (event: NativeSyntheticEvent<unknown>) => void;
	totalHeight: number;
	hiddenHeight: number;
};

/**
 *
 * Uses Reanimated library to calculate the
 * current Y offset for the TopBar
 *
 * TODO: implement snap to closest on idle animation
 *
 * NOTE: shopify lists do not work properly
 * with reanimated. We gotta use RN Animated
 *
 * a.k.a. - Scroll on Reveal behavior
 * @param onScrollJsFn (optional) is function ran on the js thread
 * @param maxHeight is equal to hidden + alwaysShownHeight
 * @param hiddenHeight is height that will be hidden
 *
 * @returns scrollY
 */
function useTopbarSmoothTranslate({
	onScrollJsFn,
	totalHeight,
	hiddenHeight,
}: Props) {
	const scrollY = useRef(new Animated.Value(0));
	const scrollYClamped = diffClamp(scrollY.current, 0, totalHeight);
	const translateY = scrollYClamped.interpolate({
		inputRange: [0, totalHeight],
		outputRange: [0, -hiddenHeight],
	});
	const translateYNumber = useRef();

	translateY.addListener(({ value }) => {
		translateYNumber.current = value;
	});

	const ref = useRef(null);
	const onScroll = Animated.event(
		[
			{
				nativeEvent: {
					contentOffset: { y: scrollY.current },
				},
			},
		],
		{
			useNativeDriver: true,
			listener: onScrollJsFn || undefined,
		},
	);

	return { onScroll, translateY, ref, scrollY };
}

export default useTopbarSmoothTranslate;
