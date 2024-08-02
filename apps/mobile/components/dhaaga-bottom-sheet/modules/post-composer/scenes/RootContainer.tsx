import PagerView from 'react-native-pager-view';
import { memo, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import AppBottomSheet from '../../../Core';
import { useAppBottomSheet } from '../../../../../hooks/app/useAppBottomSheet';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import PreviewPage from './PreviewPage';

const POST_COMPOSE_HEIGHT_MAX = 320;

// @ts-ignore-next-line
const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

const PostComposerRootContainer = memo(() => {
	const { visible } = useAppBottomSheet();
	const height = useSharedValue(0);
	useEffect(() => {
		if (!visible) {
			height.value = withTiming(0, { duration: 100 });
		} else {
			height.value = withSpring(POST_COMPOSE_HEIGHT_MAX, {
				duration: 2000,
				dampingRatio: 0.55,
				stiffness: 500,
				overshootClamping: false,
			});
		}
	}, [visible]);
	const containerStyle = useAnimatedStyle(() => {
		return {
			height: height.value,
		};
	});

	return (
		// <Animated.View
		// 	style={[
		// 		{
		// 			position: 'absolute',
		// 			bottom: 0,
		// 			width: '100%',
		// 		},
		// 		containerStyle,
		// 	]}
		// >
		// @ts-ignore-next-line
		<AnimatedPagerView
			style={[styles.root, containerStyle]}
			initialPage={0}
			// scrollEnabled={false}
		>
			<Animated.View key="1" style={{ height: 400 }}>
				<AppBottomSheet />
			</Animated.View>
			<Animated.View key="2">
				<PreviewPage />
			</Animated.View>
		</AnimatedPagerView>
		// </Animated.View>
	);
});

const styles = StyleSheet.create({
	root: {
		flex: 1,
		// height: 320,
		width: '100%',
		position: 'absolute',
		bottom: 0,
	},
});

export default PostComposerRootContainer;
