import { TimelineFetchMode } from '@dhaaga/core';
import { AppTimelineQuery } from '../features/timelines/api/useTimelineController';
import { DriverNotificationType, KNOWN_SOFTWARE } from '@dhaaga/bridge';
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
			case TimelineFetchMode.FEED: {
				return `${query?.label}`;
			}
			default: {
				return 'Unknown';
			}
		}
	}

	static notificationLabel(
		t: TFunction<LOCALIZATION_NAMESPACE.CORE[], undefined>,
		notificationType: DriverNotificationType,
		visibility?: string,
	): string {
		switch (notificationType) {
			case DriverNotificationType.FAVOURITE: {
				return t(`inbox.summary.liked`);
			}
			case DriverNotificationType.FOLLOW_REQUEST_ACCEPTED: {
				return t(`inbox.summary.followRequestAccepted`);
			}
			case DriverNotificationType.FOLLOW: {
				return t(`inbox.summary.followed`);
			}
			case DriverNotificationType.REBLOG:
			case DriverNotificationType.RENOTE: {
				return t(`inbox.summary.shared`);
			}
			case DriverNotificationType.REACTION: {
				return t(`inbox.summary.reacted`);
			}
			case DriverNotificationType.STATUS:
			case DriverNotificationType.NOTE: {
				return t(`inbox.summary.posted`);
			}
			case DriverNotificationType.REPLY: {
				return t(`inbox.summary.replied`);
			}
			case DriverNotificationType.MENTION: {
				return t(`inbox.summary.mentioned`);
			}
			case DriverNotificationType.QUOTE: {
				return 'Quoted Your Post';
			}
		}
	}
}
