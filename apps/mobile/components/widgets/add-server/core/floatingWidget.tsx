import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { APP_FONT } from '../../../../styles/AppTheme';
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import FloatingActionButtonOption from '../../../lib/FloatingActionButtonOption';
import { useFabController } from '../../../shared/fab/hooks/useFabController';
import { useAppDrawerContext } from '../../../../states/useAppDrawer';

const Y_OFFSET_MENU_ITEM = 72;

/**
 *
 * @param onPress
 * @constructor
 */
function AddServerWidget({ onPress }: { onPress: () => void }) {
	const { activeMenu, isFabExpanded, setIsFabExpanded } = useFabController();
	const { setOpen } = useAppDrawerContext();

	const rotation = useSharedValue(0);

	const displacementY = useSharedValue(0);

	const rotateElement = useCallback(() => {
		rotation.value = withTiming(
			rotation.value + 360,
			{ duration: 200, easing: Easing.linear },
			() => {
				rotation.value = 0; // Reset rotation value after completing 360 degrees
			},
		);

		if (isFabExpanded) {
			displacementY.value = withTiming(0, { duration: 360 });
		} else {
			displacementY.value = withSpring(-Y_OFFSET_MENU_ITEM);
		}

		setIsFabExpanded(!isFabExpanded);
	}, [isFabExpanded]);

	// @ts-ignore
	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ rotate: `${rotation.value}deg` }],
		};
	});

	function onPressImpl() {
		rotateElement();
	}

	return (
		<Fragment>
			<Animated.View
				style={[
					styles.widgetContainerCollapsed,
					animatedStyle,
					{
						display: activeMenu === 'drawer' ? 'none' : 'flex',
					},
				]}
				onTouchStart={onPressImpl}
			>
				<View
					style={[
						{
							display: 'flex',
							flexDirection: 'row',
							width: '100%',
							justifyContent: 'center',
							padding: 12,
							paddingVertical: 16,
						},
					]}
				>
					<View style={[{ width: 24 }]}>
						<FontAwesome5
							name="filter"
							size={24}
							color={APP_FONT.MONTSERRAT_BODY}
						/>
					</View>
				</View>
			</Animated.View>
			<FloatingActionButtonOption
				isExpanded={isFabExpanded}
				index={0}
				label={'Navigate'}
				onPress={() => {
					console.log('ok');
				}}
				icon={'navigate'}
			/>
			<FloatingActionButtonOption
				isExpanded={isFabExpanded}
				index={1}
				label={'Add a Server'}
				onPress={() => {
					console.log('ok');
				}}
				icon={'add'}
			/>
			<FloatingActionButtonOption
				isExpanded={isFabExpanded}
				index={2}
				label={'Open Drawer'}
				onPress={() => {
					setOpen(true);
				}}
				icon={'drawer'}
			/>
		</Fragment>
	);
}

export default AddServerWidget;

const styles = StyleSheet.create({
	widgetContainerCollapsed: {
		marginBottom: 16,
		backgroundColor: 'rgba(54,54,54,0.85)',
		display: 'flex',
		position: 'absolute',
		bottom: 0,
		right: 0,
		borderRadius: 16,
		maxWidth: 64,
		marginRight: 16,
		zIndex: 30,
	},
	widgetContainerCollapsedCore: {
		marginBottom: 16,
		display: 'flex',
		position: 'absolute',
		bottom: 0,
		right: 0,
		flexDirection: 'row-reverse',
		alignItems: 'center',
	},
	widgetContainerCollapsedCButton: {
		backgroundColor: 'rgba(54,54,54,0.85)',
		borderRadius: 16,
		maxWidth: 64,
		marginRight: 16,
	},
});
