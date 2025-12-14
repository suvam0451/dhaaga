import { useKeyboardHandler } from 'react-native-keyboard-controller';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

/**
 * Returns the keyboard height as a shared value
 *
 * We can place a fake view below our pages so
 * that the content is shifted up when the keyboard
 * is visible.
 * @param offPadding
 * @param onPadding
 */
function useNativeKeyboardOffset(offPadding: number, onPadding: number) {
	const height = useSharedValue(0);

	useKeyboardHandler({
		onMove: (e) => {
			'worklet';
			height.value = e.height;
		},
		onEnd: (e) => {
			'worklet';
			height.value = e.height;
		},
	});

	const hiddenViewStyle = useAnimatedStyle(() => {
		return {
			height: height.value,
			marginBottom: height.value > 0 ? 0 : 0,
		};
	}, []);

	return { height, hiddenViewStyle };
}

export { useNativeKeyboardOffset };
