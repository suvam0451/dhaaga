import React, { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

type Props = {
	children: any;
};

export default function BobbingObject({ children }: Props) {
	const translateY = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(translateY, {
					toValue: -8, // move up
					duration: 2000,
					easing: Easing.inOut(Easing.sin),
					useNativeDriver: true,
				}),
				Animated.timing(translateY, {
					toValue: 0, // move back down
					duration: 2000,
					easing: Easing.inOut(Easing.sin),
					useNativeDriver: true,
				}),
			]),
		).start();
	}, []);

	return (
		<Animated.View
			style={{
				transform: [{ translateY }],
			}}
		>
			{children}
		</Animated.View>
	);
}
