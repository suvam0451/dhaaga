import { TimelineFetchMode } from '../states/reducers/post-timeline.reducer';
import { AppTimelineQuery } from '../components/common/timeline/api/useTimelineController';
import { DhaagaJsNotificationType, KNOWN_SOFTWARE } from '@dhaaga/bridge';

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

	static notificationLabel(
		notificationType: DhaagaJsNotificationType,
		visibility?: string,
	): string {
		switch (notificationType) {
			case DhaagaJsNotificationType.FAVOURITE: {
				return 'Liked your post';
			}
			case DhaagaJsNotificationType.FOLLOW_REQUEST_ACCEPTED: {
				return 'Accepted your follow request';
			}
			case DhaagaJsNotificationType.FOLLOW: {
				return 'Followed You';
			}
			case DhaagaJsNotificationType.REBLOG:
			case DhaagaJsNotificationType.RENOTE: {
				return 'Shared your post';
			}
			case DhaagaJsNotificationType.REACTION: {
				return 'Reacted to your post';
			}
			case DhaagaJsNotificationType.STATUS: {
				return 'Posted';
			}
			case DhaagaJsNotificationType.REPLY: {
				return 'Replied to you';
			}
			case DhaagaJsNotificationType.MENTION: {
				return 'Mentioned you';
			}
		}
	}
}
