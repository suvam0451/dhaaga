import { Fragment, memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import useAnimatedHeight from './modules/_api/useAnimatedHeight';
import AppBottomSheetFactory from './fragments/AppBottomSheetFactory';
import useGlobalState from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';

/**
 * Switches what module will be shown
 * in the bottom sheet
 *
 * @param animStyle will animate the height
 * based on active module
 */
const AppBottomSheet = memo(() => {
	const { animStyle } = useAnimatedHeight();

	const { visible, hide, theme } = useGlobalState(
		useShallow((o) => ({
			visible: o.bottomSheet.visible,
			hide: o.bottomSheet.hide,
			theme: o.colorScheme,
		})),
	);

	return (
		<Fragment>
			<Pressable
				style={{
					position: 'absolute',
					height: visible ? '100%' : 'auto',
					width: '100%',
					backgroundColor: theme.palette.bg,
					opacity: 0.3,
					zIndex: 1,
				}}
				onPress={hide}
			/>
			<Animated.View
				style={[
					styles.rootContainer,
					{ backgroundColor: theme.palette.menubar },
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
