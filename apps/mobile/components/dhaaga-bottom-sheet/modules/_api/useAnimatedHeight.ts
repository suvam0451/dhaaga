import {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { useAppBottomSheet } from '../../../../hooks/utility/global-state-extractors';
import { APP_BOTTOM_SHEET_ENUM } from '../../../../states/_global';

function useAnimatedHeight() {
	const { visible, stateId, type, startAnimation, endAnimation } =
		useAppBottomSheet();
	const height = useSharedValue(0);

	useEffect(() => {
		if (!visible) {
			startAnimation();
			height.value = withTiming(0, { duration: 100 }, () => {
				runOnJS(endAnimation)();
			});
		} else {
			let _target;
			switch (type) {
				case APP_BOTTOM_SHEET_ENUM.STATUS_PREVIEW: {
					_target = Dimensions.get('window').height * 0.6;
					break;
				}
				case APP_BOTTOM_SHEET_ENUM.LINK:
				case APP_BOTTOM_SHEET_ENUM.MORE_POST_ACTIONS: {
					_target = Dimensions.get('window').height * 0.6;
					break;
				}
				case APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER: {
					_target = Dimensions.get('window').height * 0.5;
					break;
				}
				case APP_BOTTOM_SHEET_ENUM.ADD_HUB_USER:
				case APP_BOTTOM_SHEET_ENUM.ADD_HUB_TAG: {
					_target = Dimensions.get('window').height * 0.5;
					break;
				}
				default: {
					_target = Dimensions.get('window').height * 0.55;
					break;
				}
			}

			startAnimation();
			height.value = withTiming(
				_target,
				{
					duration: 200, // dampingRatio: 0.55,
					// stiffness: 500,
					// overshootClamping: false,
				},
				() => {
					runOnJS(endAnimation)();
				},
			);
		}
	}, [visible, type, stateId]);

	const animStyle = useAnimatedStyle(() => {
		return {
			height: height.value,
		};
	});

	return { animStyle };
}

export default useAnimatedHeight;
