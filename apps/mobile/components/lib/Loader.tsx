import { Animated, Easing, StyleSheet } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useAppTheme } from '#/states/global/hooks';

const CURVE = Easing.bezier(0.41, -0.15, 0.56, 1.21);
const AMPLITUDE = 4;

export function Loader() {
	const Animations = Array.from({ length: 3 }).map(() => new Animated.Value(0));

	const [Direction, setDirection] = useState(false);
	const { theme } = useAppTheme();
	const opacity = useRef(new Animated.Value(0)).current;
	const colors = [
		theme.complementaryA.a0,
		theme.complementary.a0,
		theme.complementaryB.a0,
	];

	function wave(idx: number, reverseY: boolean) {
		return Animated.sequence([
			Animated.timing(Animations[idx], {
				toValue: reverseY ? AMPLITUDE : -AMPLITUDE,
				easing: CURVE,
				delay: idx * 100,
				useNativeDriver: true,
			}),
			Animated.timing(Animations[idx], {
				toValue: reverseY ? -AMPLITUDE : AMPLITUDE,
				easing: CURVE,
				delay: idx * 100,
				useNativeDriver: true,
			}),
			Animated.timing(Animations[idx], {
				toValue: 0,
				delay: idx * 100,
				useNativeDriver: true,
			}),
		]);
	}

	function appear() {
		Animated.timing(opacity, {
			toValue: 1,
			easing: Easing.ease,
			useNativeDriver: true,
		}).start();
	}

	useEffect(() => {
		Animated.parallel(
			Animations.map((_, index) => wave(index, Direction)),
		).start(() => {
			setDirection(!Direction);
		});
		appear();
	}, [Direction, Animations]);

	return (
		<Animated.View
			style={[
				{
					opacity,
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
				},
			]}
		>
			{Animations.map((animation, i) => (
				<Animated.View
					key={i}
					style={[
						styles.animDotItem,
						{
							backgroundColor: colors[i],
							transform: [{ translateY: animation }],
						},
					]}
				/>
			))}
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	animDotItem: {
		width: 8,
		height: 8,
		marginRight: 4,
		borderRadius: '100%',
	},
});
