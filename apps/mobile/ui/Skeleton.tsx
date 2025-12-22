/**
 * Original Source Code: https://github.com/varunkukade/react-native-skaleton-kit
 *
 * Modified for use with expo, plus other simplifications
 */
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withRepeat,
	withTiming,
} from 'react-native-reanimated';
import type {
	DimensionValue,
	LayoutChangeEvent,
	ViewStyle,
} from 'react-native';
import { StyleSheet } from 'react-native';
import { useAppTheme } from '../states/global/hooks';

/**
 * Constants
 */

enum ANIMATION_DIRECTION {
	leftToRight = 'leftToRight',
	rightToLeft = 'rightToLeft',
	topToBottom = 'topToBottom',
	bottomToTop = 'bottomToTop',
}

const DEFAULT_GRADIENT = [
	'rgba(48,48,48,0)',
	'rgba(48,48,48,0.1)',
	'rgba(48,48,48,0.4)',
	'rgba(48,48,48,0.6)',
	'rgba(48,48,48,0.7)',
	'rgba(48,48,48,0.6)',
	'rgba(48,48,48,0.4)',
	'rgba(48,48,48,0.1)',
	'rgba(48,48,48,0)',
] as const;

/**
 * Typings
 */
type Props = {
	height: DimensionValue;
	width: DimensionValue;
	style?: ViewStyle;
};

const Skeleton = ({ height, width, style }: Props) => {
	const { theme } = useAppTheme();
	let direction: ANIMATION_DIRECTION = ANIMATION_DIRECTION.leftToRight;
	let backgroundColor = theme.background.a30;

	const translateX = useSharedValue(0);
	// const translateY = useSharedValue(0);

	//track dimensions of child (gradient view) for deciding movable boundaries
	const [gradientDimensions, setGradientDimensions] = useState({
		height: -1,
		width: -1,
	});
	//track dimensions of parent view (parent of gradient view) for deciding movable boundaries
	const [parentDimensions, setParentDimensions] = useState({
		height: -1,
		width: -1,
	});

	const isXDirectionAnimation = useMemo(() => {
		return (
			direction === ANIMATION_DIRECTION.leftToRight ||
			direction === ANIMATION_DIRECTION.rightToLeft
		);
	}, [direction]);

	// const isYDirectionAnimation = useMemo(() => {
	// 	return (
	// 		direction === ANIMATION_DIRECTION.topToBottom ||
	// 		direction === ANIMATION_DIRECTION.bottomToTop
	// 	);
	// }, [direction]);

	const coordinates = useMemo(() => {
		//toggle between a different direction of movement
		if (direction === ANIMATION_DIRECTION.leftToRight) {
			return {
				start: { x: 0, y: 0 },
				end: { x: 1, y: 0 },
			};
		} else if (direction === ANIMATION_DIRECTION.rightToLeft) {
			return {
				start: { x: 1, y: 0 },
				end: { x: 0, y: 0 },
			};
		} else if (direction === ANIMATION_DIRECTION.topToBottom) {
			return {
				start: { x: 0, y: 0 },
				end: { x: 0, y: 1 },
			};
		} else if (direction === ANIMATION_DIRECTION.bottomToTop) {
			return {
				start: { x: 0, y: 1 },
				end: { x: 0, y: 0 },
			};
		} else {
			return {
				start: { x: 0, y: 0 },
				end: { x: 1, y: 0 },
			};
		}
	}, [direction]);

	const animatedStyleX = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateX: translateX.value,
				},
			],
		};
	});

	// const animatedStyleY = useAnimatedStyle(() => {
	// 	return {
	// 		transform: [
	// 			{
	// 				translateY: translateY.value,
	// 			},
	// 		],
	// 	};
	// });

	const animateAcrossXDirection = () => {
		/*
		We need overflowOffset because we start moving animation little bit before actual start
		Also we end moving animation little bit after actual end.
		We hide those overflowed views using overflow: "hidden" on parent view
		*/
		const overflowOffset = parentDimensions.width * 0.75;

		/*
		In case of leftToRight direction, we start animation from leftMostEnd
		In case of rightToLeft direction, we stop animation at leftMostEnd
		*/
		const leftMostEnd = -overflowOffset;

		/*
		In case of leftToRight direction, we stop animation at rightMostEnd
		In case of rightToLeft direction, we start animation at rightMostEnd
		We subtract gradientDimensions.width because animation should end (in case of leftToRight)/start(in case of rightToLeft)
		 when leftmost end of gradient view touches the right most end of parent view
		*/
		const rightMostEnd =
			parentDimensions.width - gradientDimensions.width + overflowOffset;
		translateX.value =
			direction === ANIMATION_DIRECTION.leftToRight
				? leftMostEnd
				: rightMostEnd;
		translateX.value = withRepeat(
			withDelay(
				800, //Delay before the next iteration of animation starts
				withTiming(
					direction === ANIMATION_DIRECTION.leftToRight
						? rightMostEnd
						: leftMostEnd,
					{
						duration: 500,
						easing: Easing.linear,
					},
				),
			),
			-1,
		);
	};

	// const animateAcrossYDirection = () => {
	// 	/*
	// 	We need overflowOffset because we start moving animation little bit before actual start
	// 	Also we end moving animation little bit after actual end.
	// 	We hide those overflowed views using overflow: "hidden" style on parent view
	// 	*/
	// 	const overflowOffset = parentDimensions.height * 0.75;
	//
	// 	/*
	// 	In case of topToBottom direction, we start animation from topMostEnd
	// 	In case of bottomToTop direction, we stop animation at topMostEnd
	// 	*/
	// 	const topMostEnd = -overflowOffset;
	//
	// 	/*
	// 	In case of topToBottom direction, we stop animation at bottomMostEnd
	// 	In case of bottomToTop direction, we start animation at bottomMostEnd
	// 	We subtract gradientDimensions.height because animation should end (in case of topToBottom)/start(in case of bottomToTop)
	// 	 when topmost end of gradient view touches the bottom most end of parent view
	// 	*/
	// 	const bottomMostEnd =
	// 		parentDimensions.height - gradientDimensions.height + overflowOffset;
	// 	translateY.value =
	// 		direction === ANIMATION_DIRECTION.topToBottom
	// 			? topMostEnd
	// 			: bottomMostEnd;
	// 	translateY.value = withRepeat(
	// 		withDelay(
	// 			800, //Delay before the next iteration of animation starts
	// 			withTiming(
	// 				direction === ANIMATION_DIRECTION.topToBottom
	// 					? bottomMostEnd
	// 					: topMostEnd,
	// 				{
	// 					duration: 500,
	// 					easing: Easing.linear,
	// 				},
	// 			),
	// 		),
	// 		-1,
	// 	);
	// };

	const onParentViewLayout = (event: LayoutChangeEvent) => {
		if (parentDimensions.height === -1 && parentDimensions.width === -1) {
			//find out the width and height of parent view.
			setParentDimensions({
				width: event.nativeEvent.layout.width,
				height: event.nativeEvent.layout.height,
			});
		}
	};

	const onGradientViewLayout = (event: LayoutChangeEvent) => {
		if (gradientDimensions.width === -1 && gradientDimensions.height === -1) {
			setGradientDimensions({
				width: event.nativeEvent.layout.width,
				height: event.nativeEvent.layout.height,
			});
		}
	};

	useEffect(() => {
		if (
			parentDimensions.height !== -1 &&
			parentDimensions.width !== -1 &&
			gradientDimensions.height !== -1 &&
			gradientDimensions.width !== -1 &&
			direction
		) {
			if (isXDirectionAnimation) {
				animateAcrossXDirection();
			} else {
				// animateAcrossYDirection();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [parentDimensions, gradientDimensions, direction, isXDirectionAnimation]);

	return (
		<Animated.View
			onLayout={onParentViewLayout}
			style={[
				styles.itemParent,
				{ height: height, width: width, backgroundColor },
				style && style,
			]}
		>
			<Animated.View
				onLayout={onGradientViewLayout}
				style={[
					isXDirectionAnimation && animatedStyleX,
					isXDirectionAnimation && styles.h100 && styles.w80,
					// isYDirectionAnimation && animatedStyleY,
					// isYDirectionAnimation && styles.h100 && styles.w100,
				]}
			>
				<LinearGradient
					colors={DEFAULT_GRADIENT}
					style={styles.background}
					start={coordinates.start}
					end={coordinates.end}
				/>
			</Animated.View>
		</Animated.View>
	);
};

export { Skeleton };

const styles = StyleSheet.create({
	h100: {
		height: '100%',
	},
	w80: {
		width: '80%',
	},
	// w100: {
	// 	width: '100%',
	// },
	itemParent: {
		overflow: 'hidden',
	},
	background: {
		height: '100%',
		width: '100%',
	},
});
