import {
	useAnimatedStyle,
	useSharedValue,
	withDelay,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import { useEffect, useRef } from 'react';
import { FAB_MENU_PER_ITEM_OFFSET } from '../modules/_common';
import { useFabController } from './useFabController';

/**
 * Calculates the rotation and y offset
 * for menu items
 *
 * isExpanded can be obtained from useLocalAppMenuControllerContext
 * @param index is the index of item from bottom (0 based)
 * @param isExpanded
 */
function useFabMenuItemAnim(index: number, isExpanded: boolean) {
	const { textAnim } = useFabController();
	const yOffset = useRef(-(index + 1) * FAB_MENU_PER_ITEM_OFFSET);

	const displacementY = useSharedValue(0);

	useEffect(() => {
		if (isExpanded) {
			displacementY.value = withSpring(yOffset.current);
		} else {
			displacementY.value = withTiming(0, { duration: 360 });
		}
	}, [isExpanded]);

	// @ts-ignore-next-line
	const divAnim = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: displacementY.value }],
		};
	});

	return { textAnim, divAnim };
}

export default useFabMenuItemAnim;
