import { formatDistanceToNowStrict } from 'date-fns';

const INVALID_TIME_PLACEHOLDER = 'invalid time input';

class LocalizationService {
	static formatDistanceToNowStrict(dt?: Date): string {
		if (!dt) {
			return INVALID_TIME_PLACEHOLDER;
		}
		try {
			return formatDistanceToNowStrict(dt);
		} catch (e) {
			return INVALID_TIME_PLACEHOLDER;
		}
	}
}

export default LocalizationService;
