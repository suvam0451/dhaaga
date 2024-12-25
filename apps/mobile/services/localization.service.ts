import { TimelineFetchMode } from '../states/reducers/timeline.reducer';
import { AppTimelineQuery } from '../components/common/timeline/api/useTimelineController';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';

export class LocalizationService {
	/**
	 * Generates the header label for
	 * the timeline interface
	 * @param type
	 * @param query
	 * @param driver
	 */
	static timelineLabelText(
		type: TimelineFetchMode,
		query: AppTimelineQuery | null,
		driver: KNOWN_SOFTWARE | string,
	) {
		switch (type) {
			case TimelineFetchMode.IDLE:
				return 'Idle';
			case TimelineFetchMode.HOME:
				return 'Home';
			case TimelineFetchMode.SOCIAL:
				return 'Social';
			case TimelineFetchMode.BUBBLE:
				return 'Bubble Timeline';
			case TimelineFetchMode.LOCAL:
				return 'Local';
			case TimelineFetchMode.LIST: {
				return `List: ${query?.label}`;
			}
			case TimelineFetchMode.HASHTAG: {
				return `#${query?.label}`;
			}
			case TimelineFetchMode.USER: {
				return `${query?.label}`;
			}
			case TimelineFetchMode.FEDERATED: {
				return [KNOWN_SOFTWARE.PLEROMA, KNOWN_SOFTWARE.AKKOMA].includes(
					driver as KNOWN_SOFTWARE,
				)
					? `Known Network`
					: `Federated`;
			}
			default: {
				return 'Unknown';
			}
		}
	}
}
