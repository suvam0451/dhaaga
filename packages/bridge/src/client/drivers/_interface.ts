import { InstanceRoute } from '../collections/servers/_interface.js';
import { AccountRoute } from '../collections/accounts/_interface.js';
import { StatusesRoute } from '../collections/posts/_interface.js';
import { TrendsRoute } from '../collections/trends/_interface.js';
import { NotificationsRoute } from '../collections/notifications/_interface.js';
import {
	DhaagaJsTimelineQueryOptions,
	TimelinesRoute,
} from '../collections/timelines/_interface.js';
import { TagRoute } from '../collections/tags/_interface.js';
import {
	DhaagaJsPostSearchDTO,
	DhaagaJsUserSearchDTO,
	SearchRoute,
} from '../collections/search/_interface.js';
import { MeRoute } from '../collections/me/_interface.js';
import { MediaRoute } from '../collections/media/_interface.js';
import { ListsRoute } from '../collections/lists/_interface.js';
import { ProfileRoute } from '../collections/profile/_interface.js';
// mutators
import { PostMutatorRoute } from '../shared/post.js';
import { UserRoute } from '../shared/wrapper.js';
import { KNOWN_SOFTWARE } from '#/client/utils/driver.js';

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
