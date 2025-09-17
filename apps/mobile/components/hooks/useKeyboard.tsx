import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

function useKeyboard() {
	const [KeyboardVisible, setKeyboardVisible] = useState(false);

	/**
	 * Handle keyboard
	 */
	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			'keyboardDidShow',
			() => {
				setKeyboardVisible(true); // or some other action
			},
		);
		const keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => {
				setKeyboardVisible(false); // or some other action
			},
		);

		return () => {
			keyboardDidHideListener.remove();
			keyboardDidShowListener.remove();
		};
	}, []);

	return { KeyboardVisible };
}

export default useKeyboard;
