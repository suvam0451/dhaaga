import useKeyboard from '../hooks/useKeyboard';
import { StyleProp, View, ViewStyle } from 'react-native';

type Props = {
	style?: StyleProp<ViewStyle>;
	children: any;
};

function HideOnKeyboardVisibleContainer({ children, style }: Props) {
	const { KeyboardVisible } = useKeyboard();

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

export default HideOnKeyboardVisibleContainer;
