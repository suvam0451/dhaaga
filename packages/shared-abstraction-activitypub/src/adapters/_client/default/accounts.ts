import { AccountRoute } from '../_router/routes/accounts.js';
import { DhaagaErrorCode } from '../_router/_types.js';

export class DefaultAccountsRouter implements AccountRoute {
	async statuses() {
		return {
			error: {
				code: DhaagaErrorCode.SOFTWARE_UNSUPPORTED_BY_LIBRARY,
			},
		};
	}
}
