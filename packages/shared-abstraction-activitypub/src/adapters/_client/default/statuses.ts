import { DhaagaErrorCode, LibraryResponse } from '../_router/_types.js';
import { StatusesRoute } from '../_router/routes/statuses.js';
import { MastoStatus } from '../_interface.js';

export class DefaultStatusesRouter implements StatusesRoute {
	async get(id: string): Promise<LibraryResponse<MastoStatus>> {
		return {
			error: {
				code: DhaagaErrorCode.SOFTWARE_UNSUPPORTED_BY_LIBRARY,
			},
		};
	}
}
