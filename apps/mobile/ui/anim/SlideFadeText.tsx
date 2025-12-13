import React, { useRef, useState, useEffect } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

type SlideFadeTextProps = {
	items: string[];
	interval?: number; // optional, time between switches in ms
};

export default function SlideFadeText({
	items,
	interval = 20000,
}: SlideFadeTextProps) {
	const [index, setIndex] = useState(0);
	const [text, setText] = useState(items[0]);

	const translateY = useRef(new Animated.Value(0)).current;
	const opacity = useRef(new Animated.Value(1)).current;

	const changeText = () => {
		Animated.parallel([
			Animated.timing(opacity, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}),
			Animated.timing(translateY, {
				toValue: -10,
				duration: 200,
				useNativeDriver: true,
			}),
		]).start(() => {
			// move to the next index
			const nextIndex = (index + 1) % items.length;
			setIndex(nextIndex);
			setText(items[nextIndex]);

			// reset translation for incoming animation
			translateY.setValue(10);

			Animated.parallel([
				Animated.timing(opacity, {
					toValue: 1,
					duration: 200,
					useNativeDriver: true,
				}),
				Animated.timing(translateY, {
					toValue: 0,
					duration: 200,
					useNativeDriver: true,
				}),
			]).start();
		});
	};

	useEffect(() => {
		const intervalId = setInterval(changeText, interval);
		return () => clearInterval(intervalId);
	}, [index]); // include index so we always get the latest value

	return (
		<View style={styles.container}>
			<Animated.Text
				style={{
					fontSize: 18,
					color: 'white',
					fontWeight: 600,
					opacity,
					transform: [{ translateY }],
				}}
			>
				{text}
			</Animated.Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
	},
});
