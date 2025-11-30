import { useKeyboardHandler } from 'react-native-keyboard-controller';
import { useSharedValue } from 'react-native-reanimated';

function useNativeKeyboardAnimation(offPadding: number, onPadding: number) {
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

	return { height };
}

export { useNativeKeyboardAnimation };
