import { InstanceRoute } from '../instance.js';
import { AccountRoute } from './accounts.js';
import { StatusesRoute } from './statuses.js';
import { BookmarksRoute } from './bookmarks.js';

export interface RouterInterface {
	instances: InstanceRoute;
	accounts: AccountRoute;
	statuses: StatusesRoute;
	bookmarks: BookmarksRoute;
}

export type { InstanceRoute, AccountRoute, StatusesRoute };
