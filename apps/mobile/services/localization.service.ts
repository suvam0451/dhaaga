import { TimelineFetchMode } from '../states/interactors/post-timeline.reducer';
import { AppTimelineQuery } from '../features/timelines/api/useTimelineController';
import { DhaagaJsNotificationType, KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { TFunction } from 'i18next';
import { LOCALIZATION_NAMESPACE } from '../types/app.types';

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
		t: TFunction<LOCALIZATION_NAMESPACE.CORE[], undefined>,
		notificationType: DhaagaJsNotificationType,
		visibility?: string,
	): string {
		switch (notificationType) {
			case DhaagaJsNotificationType.FAVOURITE: {
				return t(`inbox.summary.liked`);
			}
			case DhaagaJsNotificationType.FOLLOW_REQUEST_ACCEPTED: {
				return t(`inbox.summary.followRequestAccepted`);
			}
			case DhaagaJsNotificationType.FOLLOW: {
				return t(`inbox.summary.followed`);
			}
			case DhaagaJsNotificationType.REBLOG:
			case DhaagaJsNotificationType.RENOTE: {
				return t(`inbox.summary.shared`);
			}
			case DhaagaJsNotificationType.REACTION: {
				return t(`inbox.summary.reacted`);
			}
			case DhaagaJsNotificationType.STATUS:
			case DhaagaJsNotificationType.NOTE: {
				return t(`inbox.summary.posted`);
			}
			case DhaagaJsNotificationType.REPLY: {
				return t(`inbox.summary.replied`);
			}
			case DhaagaJsNotificationType.MENTION: {
				return t(`inbox.summary.mentioned`);
			}
		}
	}
}
