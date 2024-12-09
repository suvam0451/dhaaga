import { Fragment, memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import useAnimatedHeight from './modules/_api/useAnimatedHeight';
import AppBottomSheetFactory from './fragments/AppBottomSheetFactory';
import { useAppBottomSheet } from './modules/_api/useAppBottomSheet';
import { useAppTheme } from '../../hooks/app/useAppThemePack';

/**
 * Switches what module will be shown
 * in the bottom sheet
 *
 * @param animStyle will animate the height
 * based on active module
 */
const AppBottomSheet = memo(() => {
	const { colorScheme } = useAppTheme();
	const { animStyle } = useAnimatedHeight();
	const { visible, setVisible } = useAppBottomSheet();

	function onBackgroundPress() {
		setVisible(false);
	}

	return (
		<Fragment>
			<Pressable
				style={{
					position: 'absolute',
					height: visible ? '100%' : 'auto',
					width: '100%',
					backgroundColor: colorScheme.palette.bg,
					opacity: 0.3,
					zIndex: 1,
				}}
				onPress={onBackgroundPress}
			/>
			<Animated.View
				style={[
					styles.rootContainer,
					{ backgroundColor: colorScheme.palette.menubar },
					animStyle,
				]}
			>
				<AppBottomSheetFactory />
			</Animated.View>
		</Fragment>
	);
});

const styles = StyleSheet.create({
	rootContainer: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		borderTopRightRadius: 8,
		borderTopLeftRadius: 8,
		zIndex: 2,
	},
});

export default AppBottomSheet;
