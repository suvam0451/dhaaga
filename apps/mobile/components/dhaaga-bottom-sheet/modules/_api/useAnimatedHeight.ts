import {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { Dimensions } from 'react-native';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_BOTTOM_SHEET_ENUM } from '../../Core';

const POST_COMPOSE_HEIGHT_MAX = 420;

function useAnimatedHeight() {
	const { visible, type } = useGlobalState(
		useShallow((o) => ({
			visible: o.bottomSheet.visible,
			type: o.bottomSheet.type,
		})),
	);
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
					_target = Dimensions.get('window').height * 0.4;
					break;
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
	}, [visible, type]);

	const animStyle = useAnimatedStyle(() => {
		return {
			height: height.value,
		};
	});

	return { animStyle };
}

export default useAnimatedHeight;
