import { InstanceRoute } from './instance.js';
import { AccountRoute } from './routes/accounts.js';
import { StatusesRoute } from './routes/statuses.js';

export interface RouterInterface {
	instances: InstanceRoute;
	accounts: AccountRoute;
	statuses: StatusesRoute;
}

export type { InstanceRoute, AccountRoute, StatusesRoute };
