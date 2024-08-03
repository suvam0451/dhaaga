import { BOTTOM_SHEET_ENUM, useAppBottomSheet } from './useAppBottomSheet';
import {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';

const POST_COMPOSE_HEIGHT_MAX = 360;

function useAnimatedHeight() {
	const { visible, type } = useAppBottomSheet();
	const height = useSharedValue(0);

	useEffect(() => {
		if (!visible) {
			height.value = withTiming(0, { duration: 100 });
		} else {
			let _target;
			switch (type) {
				case BOTTOM_SHEET_ENUM.STATUS_PREVIEW: {
					_target = Dimensions.get('window').height * 0.6;
					break;
				}
				case BOTTOM_SHEET_ENUM.STATUS_COMPOSER: {
					_target = POST_COMPOSE_HEIGHT_MAX;
					break;
				}
				default: {
					_target = POST_COMPOSE_HEIGHT_MAX;
					break;
				}
			}

			height.value = withSpring(_target, {
				duration: 2000,
				dampingRatio: 0.55,
				stiffness: 500,
				overshootClamping: false,
			});
		}
	}, [visible, type]);

	const animStyle = useAnimatedStyle(() => {
		return {
			height: height.value,
		};
	});

	return { animStyle };
}

export default useAnimatedHeight;
