import { useAppBottomSheet } from '../../../../hooks/app/useAppBottomSheet';
import {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const POST_COMPOSE_HEIGHT_MAX = 320;

function useAnimatedHeight() {
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

	const animStyle = useAnimatedStyle(() => {
		return {
			height: height.value,
		};
	});

	return { animStyle };
}

export default useAnimatedHeight;
