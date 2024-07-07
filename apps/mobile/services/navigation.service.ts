import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

class NavigationService {
	/**
	 * invoke callback, when Animated.ScrollView onScroll
	 * event indicates a specific distance away from bottom
	 * @param e event
	 * @param callback this function will be called
	 */
	static invokeWhenPageEndReached(
		e: NativeSyntheticEvent<NativeScrollEvent>,
		callback: Function,
	) {
		const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
		const paddingToBottom = 40;
		if (
			layoutMeasurement.height + contentOffset.y >=
			contentSize.height - paddingToBottom
		) {
			callback();
		}
		return (
			layoutMeasurement.height + contentOffset.y >=
			contentSize.height - paddingToBottom
		);
	}
}

export default NavigationService;
