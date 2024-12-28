import { View } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

type AppPickerProps = {
	title: string;
	desc: string;
	items: {
		label: string;
		id: string;
	}[];
};

/**
 * iOS style app picker
 */
export function AppPicker() {
	const translateY = useSharedValue(0);
	return (
		<View>
			<PanGestureHandler>
				<Animated.View style={{}}></Animated.View>
			</PanGestureHandler>
		</View>
	);
}
