import { useEffect, useState } from 'react';
import { Keyboard, View } from 'react-native';

type HideWhileKeyboardActiveProps = {
	children: any;
	style?: any;
};

export function HideWhileKeyboardActive({
	children,
	style,
}: HideWhileKeyboardActiveProps) {
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

	return (
		<View
			style={[
				style,
				{
					display: KeyboardVisible ? 'none' : 'flex',
				},
			]}
		>
			{children}
		</View>
	);
}
