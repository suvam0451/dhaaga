import {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import { APP_BOTTOM_SHEET_ENUM } from '../../Core';
import { useAppBottomSheet_Improved } from '../../../../hooks/utility/global-state-extractors';

const POST_COMPOSE_HEIGHT_MAX = 420;

function useAnimatedHeight() {
	const { visible, stateId, type } = useAppBottomSheet_Improved();
	const height = useSharedValue(0);

	useEffect(() => {
		if (!visible) {
			height.value = withTiming(0, { duration: 100 });
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
					_target = Dimensions.get('window').height * 0.7;
				}
				default: {
					_target = Dimensions.get('window').height * 0.55;
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
	}, [visible, type, stateId]);

	const animStyle = useAnimatedStyle(() => {
		return {
			height: height.value,
		};
	});

	return { animStyle };
}

export default useAnimatedHeight;
