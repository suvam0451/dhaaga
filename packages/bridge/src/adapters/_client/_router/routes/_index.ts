import { InstanceRoute } from './instance.js';
import { AccountRoute } from './accounts.js';
import { StatusesRoute } from './statuses.js';
import { TrendsRoute } from './trends.js';
import { NotificationsRoute } from './notifications.js';
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
// mutators
import { PostMutatorRoute } from './post.js';
import { UserRoute } from './user.js';
import { KNOWN_SOFTWARE } from '../../../../data/driver.js';

interface ApiTargetInterface {
	driver: KNOWN_SOFTWARE | string;
	server: string | null;

	/**
	 * a unique identifier for this account,
	 * so that accidentally making the same request
	 * with another account doesn't result in the
	 * same response and bug out the UI
	 */
	key: string;

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
	// mutators
	post: PostMutatorRoute;
	user: UserRoute;
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
export type {
	ApiTargetInterface,
	DhaagaJsTimelineQueryOptions,
	DhaagaJsUserSearchDTO,
	DhaagaJsPostSearchDTO,
};
