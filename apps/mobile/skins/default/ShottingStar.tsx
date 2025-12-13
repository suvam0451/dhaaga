import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	withSequence,
	withDelay,
	runOnJS,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const { width, height } = Dimensions.get('window');

export default function ShootingStar({
	size = 4,
	duration = 1200,
	waitMin = 1500,
	waitMax = 6000,
}) {
	const x = useSharedValue(-50);
	const y = useSharedValue(-50);
	const opacity = useSharedValue(0);

	const random = (min, max) => Math.random() * (max - min) + min;

	const launch = () => {
		// Start at a random point slightly above the screen
		const startX = random(-100, width * 0.4);
		const startY = random(-200, height * 0.3);

		// End further down diagonally
		const endX = startX + random(width * 0.5, width * 1.2);
		const endY = startY + random(height * 0.3, height * 0.8);

		// Reset star position/opacities
		x.value = startX;
		y.value = startY;
		opacity.value = 0;

		const delay = random(waitMin, waitMax);

		// Delay → fade in → travel → fade out → restart
		opacity.value = withDelay(
			delay,
			withSequence(
				withTiming(1, { duration: 200 }),
				withTiming(0, { duration: duration }),
			),
		);

		x.value = withDelay(delay, withTiming(endX, { duration }));

		y.value = withDelay(
			delay,
			withTiming(endY, { duration }, () => {
				/**
				 * Restart at end of animation
				 *
				 * NOTE: crash issues with worklets
				 * (scheduleOnRN)
				 */
				runOnJS(launch)();
			}),
		);
	};

	useEffect(() => {
		launch(); // Start loop
	}, []);

	const style = useAnimatedStyle(() => ({
		position: 'absolute',
		top: y.value,
		left: x.value,
		opacity: opacity.value,
		width: size,
		height: size,
		borderRadius: size / 2,
		backgroundColor: 'white',
		transform: [{ rotate: '-45deg' }],
	}));

	return <Animated.View style={style} />;
}
