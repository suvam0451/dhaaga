import * as Haptics from 'expo-haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';

class Utils {
	/**
	 *
	 * @param isLoaded is a syntactic sugar to work well
	 * with the event bus system (when an event ends,
	 * it returns false via the "loader" function)
	 */
	static medium(isLoaded?: boolean) {
		if (isLoaded !== undefined) {
			if (isLoaded === false) Haptics.impactAsync(ImpactFeedbackStyle.Medium);
		} else {
			Haptics.impactAsync(ImpactFeedbackStyle.Medium);
		}
	}
}

export { Utils as HapticUtils };
