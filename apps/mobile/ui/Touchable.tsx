import { useRef } from 'react';
import { Pressable } from 'react-native';

type TouchableHighlightDisabledOnSwipeProps = {
	onPress: (e: any) => void;
	onPressIn?: (e: any) => void;
	props?: any;
	children: any;
};

/**
 * This TouchableHighlight will be disabled when
 * the parent container (presumably a PagerView)
 * is being swiped
 * @param onPress
 * @param onPressIn
 * @param props
 * @constructor
 */
function PressableDisabledOnSwipe({
	onPress,
	onPressIn,
	...props
}: TouchableHighlightDisabledOnSwipeProps) {
	const _touchActivatePositionRef = useRef(null);

	function _onPressIn(e) {
		const { pageX, pageY } = e.nativeEvent;
		_touchActivatePositionRef.current = {
			pageX,
			pageY,
		};

		onPressIn?.(e);
	}

	function _onPress(e) {
		const { pageX, pageY } = e.nativeEvent;

		const absX = Math.abs(_touchActivatePositionRef.current.pageX - pageX);
		const absY = Math.abs(_touchActivatePositionRef.current.pageY - pageY);

		const dragged = absX > 2 || absY > 2;
		if (!dragged) {
			onPress?.(e);
		}
	}

	return (
		<Pressable onPressIn={_onPressIn} onPress={_onPress} {...props}>
			{props.children}
		</Pressable>
	);
}

export { PressableDisabledOnSwipe };
