import { DhaagaErrorCode, LibraryResponse } from '../_router/_types.js';
import { StatusesRoute } from '../_router/routes/statuses.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import { MastoStatus } from '../_interface.js';
import { DhaagaMastoClient, MastoErrorHandler } from '../_router/_runner.js';
import { createRestAPIClient } from 'masto';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';

export class MastodonStatusesRouter implements StatusesRoute {
	client: RestClient;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
	}

	async get(id: string): Promise<LibraryResponse<MastoStatus>> {
		try {
			const client = createRestAPIClient({
				url: this.client.url,
				accessToken: this.client.accessToken || undefined,
			}) as any;

			const fn = DhaagaMastoClient(
				this.client.url,
				this.client.accessToken,
			).client.v1.statuses.$select(id).fetch;

			const { data, error } = await MastoErrorHandler(fn);
			if (error || !data) return errorBuilder();
			const retData = await data;
			return { data: retData };
		} catch (e) {
			console.log('[ERROR]', JSON.stringify(e), e?.toString());
			return {
				error: {
					code: DhaagaErrorCode.UNKNOWN_ERROR,
					message: e,
				},
			};
		}

		// const { data, error } = await MastoErrorHandler(fn);
		// if (error) return { error };
		// const x = await data;
		// if (!x) return { error: { code: DhaagaErrorCode.UNKNOWN_ERROR } };
		// return { data: x };
	}
}
