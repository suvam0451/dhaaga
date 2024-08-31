import { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import useAnimatedHeight from './modules/_api/useAnimatedHeight';
import AppBottomSheetCloseButton from './fragments/AppBottomSheetCloseButton';
import AppBottomSheetFactory from './fragments/AppBottomSheetFactory';

/**
 * Switches what module will be shown
 * in the bottom sheet
 *
 * @param animStyle will animate the height
 * based on active module
 */
const AppBottomSheet = memo(() => {
	const { animStyle } = useAnimatedHeight();

	return (
		<Animated.View style={[styles.rootContainer, animStyle]}>
			<AppBottomSheetCloseButton />
			<AppBottomSheetFactory />
		</Animated.View>
	);
});

const styles = StyleSheet.create({
	rootContainer: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		borderTopRightRadius: 8,
		borderTopLeftRadius: 8,
		backgroundColor: '#2C2C2C',
	},
});

export default AppBottomSheet;
