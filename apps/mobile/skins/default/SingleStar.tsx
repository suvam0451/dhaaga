import React, { useEffect } from 'react';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	withRepeat,
	withSequence,
} from 'react-native-reanimated';

// Your SVG component
import SmallStar from '#/skins/default/SmallStar';

// Turn your SVG into an animated component
const AnimatedSmallStar = Animated.createAnimatedComponent(SmallStar);

export default function Star({ size = 24, minOpacity = 0.2, maxOpacity = 1 }) {
	const opacity = useSharedValue(0);

	useEffect(() => {
		const flashDuration = () => 50 + Math.random() * 200; // quick flash
		const hiddenDuration = () => 8000 + Math.random() * 7000; // long hidden

		opacity.value = withRepeat(
			withSequence(
				withTiming(maxOpacity, { duration: flashDuration() }),
				withTiming(minOpacity, { duration: hiddenDuration() }),
			),
			-1,
			false,
		);
	}, []);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			opacity: opacity.value,
			width: size,
			height: size,
		};
	});

	return <AnimatedSmallStar width={size} height={size} style={animatedStyle} />;
}
