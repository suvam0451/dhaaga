import { InstanceRoute } from './instance.js';
import { AccountRoute } from './accounts.js';
import { StatusesRoute } from './statuses.js';
import { TrendsRoute } from './trends.js';
import {
	DhaagaJsNotificationType,
	NotificationsRoute,
} from './notifications.js';
import { DhaagaJsTimelineQueryOptions, TimelinesRoute } from './timelines.js';
import { TagRoute } from './tags.js';
import {
	DhaagaJsPostSearchDTO,
	DhaagaJsUserSearchDTO,
	SearchRoute,
} from './search.js';
import { MeRoute } from './me.js';
import { MediaRoute } from './media.js';
import { ListsRoute } from './lists.js';
import { ParserRoute } from './parser.js';
import { ProfileRoute } from './profile.js';

export interface RouterInterface {
	instances: InstanceRoute;
	accounts: AccountRoute;
	statuses: StatusesRoute;
	trends: TrendsRoute;
	notifications: NotificationsRoute;
	timelines: TimelinesRoute;
	tags: TagRoute;
	search: SearchRoute;
	me: MeRoute;
	media: MediaRoute;
	lists: ListsRoute;
	// profile: ProfileRoute;
}

export type {
	AccountRoute,
	InstanceRoute,
	ListsRoute,
	MeRoute,
	MediaRoute,
	NotificationsRoute,
	ParserRoute,
	ProfileRoute,
	SearchRoute,
	StatusesRoute,
	TagRoute,
	TimelinesRoute,
	TrendsRoute,
};

/**
 * export typings and DTOs
 */
export {
	DhaagaJsTimelineQueryOptions,
	DhaagaJsNotificationType, // search
	DhaagaJsUserSearchDTO,
	DhaagaJsPostSearchDTO,
};
