import { InstanceRoute } from '../instance.js';
import { AccountRoute } from './accounts.js';
import { StatusesRoute } from './statuses.js';
import { BookmarksRoute } from './bookmarks.js';
import { TrendsRoute } from './trends.js';
import {
	DhaagaJsNotificationType,
	NotificationsRoute,
} from './notifications.js';
import { DhaagaJsTimelineQueryOptions, TimelinesRoute } from './timelines.js';

export interface RouterInterface {
	instances: InstanceRoute;
	accounts: AccountRoute;
	statuses: StatusesRoute;
	bookmarks: BookmarksRoute;
	trends: TrendsRoute;
	notifications: NotificationsRoute;
	timelines: TimelinesRoute;
}

export type { InstanceRoute, AccountRoute, StatusesRoute };

/**
 * export typings and DTOs
 */
export { DhaagaJsTimelineQueryOptions, DhaagaJsNotificationType };
