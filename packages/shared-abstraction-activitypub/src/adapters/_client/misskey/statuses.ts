import { DhaagaErrorCode, LibraryResponse } from '../_router/_types.js';
import {
	DhaagaJsPostCreateDto,
	StatusesRoute,
} from '../_router/routes/statuses.js';
import {
	MastoScheduledStatus,
	MastoStatus,
	MissContext,
	MissNote,
} from '../_interface.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMisskeyClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { Endpoints } from 'misskey-js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import AppApi from '../../_api/AppApi.js';

type RenoteCreateDTO = {
	localOnly: boolean;
	renoteId: string;
	visibility: 'followers';
};

export class MisskeyStatusesRouter implements StatusesRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MISSKEYJS>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMisskeyClient(this.client.url, this.client.accessToken);
	}

	async create(
		dto: DhaagaJsPostCreateDto,
	): LibraryPromise<MastoScheduledStatus> {
		try {
			const data = await this.lib.client.request<
				// @ts-ignore-next-line
				Endpoints['notes/create']['req'],
				any
			>('notes/create', {
				// ...dto,
				lang: dto.language,
				visibility: dto.misskeyVisibility,
				replyId: dto.inReplyToId,
				text: dto.status,
				visibleUserIds: dto.visibleUserIds || [],
				fileIds: dto.mediaIds || [],
				cw: dto.spoilerText,
				// reactionAcceptance: null,
				// poll: dto.poll || null,
				// cw: dto.spoilerText || null,
			});
			return { data: data as any };
		} catch (e: any) {
			if (e.code) {
				return errorBuilder(e);
			}
			console.log(e);
			return errorBuilder(DhaagaErrorCode.UNAUTHORIZED);
		}
	}

	async delete(id: string): LibraryPromise<{ success: true }> {
		try {
			// @ts-ignore-next-line
			await this.lib.client.request('notes/delete', {
				noteId: id,
			});
			return { data: { success: true } };
		} catch (e: any) {
			if (e.code) {
				return errorBuilder(e);
			}
			console.log(e);
			return errorBuilder(DhaagaErrorCode.UNAUTHORIZED);
		}
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

	async renotes(id: string): LibraryPromise<Endpoints['notes/renotes']['res']> {
		try {
			const data = await this.lib.client.request('notes/renotes', {
				noteId: id,
			});
			return { data };
		} catch (e: any) {
			if (e.code) {
				return errorBuilder(e);
			}
			console.log(e);
			return errorBuilder(DhaagaErrorCode.UNAUTHORIZED);
		}
	}

	/**
	 * a.k.a. like -- applicable for Sharkey only
	 * @param id
	 */
	async favourite(id: string): LibraryPromise<{
		success: boolean;
		isFavourited: true;
	}> {
		const { error } = await new AppApi(
			this.client.url,
			this.client.accessToken,
		).post('/api/notes/like', { noteId: id }, {});
		if (error) return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		return { data: { success: true, isFavourited: true } };
	}

	/**
	 * a.k.a. like -- applicable for Sharkey only
	 * @param id
	 */
	async like(
		id: string,
	): LibraryPromise<{ success: boolean; hasReacted: true }> {
		const { error } = await new AppApi(
			this.client.url,
			this.client.accessToken,
		).post('/api/notes/like', { noteId: id }, {});
		if (error) return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		return { data: { success: true, hasReacted: true } };
	}

	async removeLike(id: string): LibraryPromise<MastoStatus> {
		return errorBuilder<MastoStatus>(DhaagaErrorCode.UNKNOWN_ERROR);
	}

	/**
	 * Possible to renote multiple times
	 * @param dto
	 */
	async renote(dto: RenoteCreateDTO): LibraryPromise<{
		success: true;
		renoted: true;
		post: Endpoints['notes/create']['res'];
	}> {
		try {
			const data = await this.lib.client.request('notes/create', dto);
			return {
				data: {
					success: true,
					renoted: true,
					post: data,
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

	async unrenote(id: string): LibraryPromise<{
		success: true;
		renoted: false;
	}> {
		try {
			await this.lib.client.request('notes/unrenote', {
				noteId: id,
			});
			return { data: { success: true, renoted: false } };
		} catch (e: any) {
			if (e.code) {
				return errorBuilder(e);
			}
			console.log(e);
			return errorBuilder(DhaagaErrorCode.UNAUTHORIZED);
		}
	}

	async getContext(id: string, limit?: number): LibraryPromise<MissContext> {
		try {
			const parents = this.lib.client.request('notes/conversation', {
				noteId: id,
				limit: limit || 40,
			});
			const children = this.lib.client.request('notes/children', {
				noteId: id,
				showQuotes: false,
				limit: limit || 40,
			});

			return new Promise((resolve, reject) => {
				Promise.all([parents, children])
					.then(([_parents, _children]) => {
						resolve({
							data: {
								ancestors: _parents,
								descendants: _children,
							},
						});
					})
					.catch((e) => {
						return resolve({ data: { ancestors: [], descendants: [] } });
					});
			});
		} catch (e) {
			console.log(e);
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}
}
