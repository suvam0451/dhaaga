import { InstanceRoute } from '../instance.js';
import { AccountRoute } from './accounts.js';
import { StatusesRoute } from './statuses.js';
import { BookmarksRoute } from './bookmarks.js';
import { TrendsRoute } from './trends.js';

export interface RouterInterface {
	instances: InstanceRoute;
	accounts: AccountRoute;
	statuses: StatusesRoute;
	bookmarks: BookmarksRoute;
	trends: TrendsRoute;
}

export type { InstanceRoute, AccountRoute, StatusesRoute };
