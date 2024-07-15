import {
	AccountRoute,
	AccountRouteStatusQueryDto,
} from '../_router/routes/accounts.js';
import { DhaagaErrorCode, LibraryResponse } from '../_router/_types.js';
import { MastoAccount, MastoStatus } from '../_interface.js';

export abstract class BaseAccountsRouter implements AccountRoute {
	async get(id: string): Promise<LibraryResponse<MastoAccount>> {
		return {
			error: {
				code: DhaagaErrorCode.SOFTWARE_UNSUPPORTED_BY_LIBRARY,
			},
		} as LibraryResponse<MastoAccount>;
	}

	async statuses(
		id: string,
		query: AccountRouteStatusQueryDto,
	): Promise<LibraryResponse<MastoStatus[]>> {
		return {
			error: {
				code: DhaagaErrorCode.SOFTWARE_UNSUPPORTED_BY_LIBRARY,
			},
		};
	}
}

export class DefaultAccountRouter extends BaseAccountsRouter {}
