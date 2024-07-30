import { DhaagaErrorCode, LibraryResponse } from '../_router/_types.js';
import { StatusesRoute } from '../_router/routes/statuses.js';
import { MissNote } from '../_interface.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMisskeyClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { Endpoints } from 'misskey-js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';

export class MisskeyStatusesRouter implements StatusesRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MISSKEYJS>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMisskeyClient(this.client.url, this.client.accessToken);
	}

	async get(id: string): Promise<LibraryResponse<MissNote>> {
		const data = await this.lib.client.request('notes/show', { noteId: id });
		return { data };
	}

	async getReactions(id: string) {
		// return await client.request('notes/reactions', { noteId });
	}

	async getState(id: string): LibraryPromise<Endpoints['notes/state']['res']> {
		try {
			const data = await this.lib.client.request('notes/state', { noteId: id });
			return { data };
		} catch (e: any) {
			if (e.code) {
				return errorBuilder(e);
			}
			console.log(e);
			return errorBuilder(DhaagaErrorCode.UNAUTHORIZED);
		}
	}

	async bookmark(
		id: string,
	): LibraryPromise<Endpoints['notes/favorites/create']['res']> {
		try {
			await this.lib.client.request('notes/favorites/create', {
				noteId: id,
			});
			return {
				data: {
					success: true,
					isBookmarked: true,
				},
			};
		} catch (e: any) {
			if (e.code) {
				return errorBuilder(e);
			}
			console.log(e);
			return errorBuilder(DhaagaErrorCode.UNAUTHORIZED);
		}
	}

	async unBookmark(
		id: string,
	): LibraryPromise<Endpoints['notes/favorites/delete']['res']> {
		try {
			await this.lib.client.request('notes/favorites/delete', {
				noteId: id,
			});
			return {
				data: {
					success: true,
					isBookmarked: false,
				},
			};
		} catch (e: any) {
			if (e.code) {
				return errorBuilder(e);
			}
			console.log(e);
			return errorBuilder(DhaagaErrorCode.UNAUTHORIZED);
		}
	}
}
