import { DhaagaJsPostCreateDto, StatusesRoute } from './_interface.js';
import { Endpoints } from 'misskey-js';
import FetchWrapper from '#/client/utils/fetch.js';
import type { MissContext, MissNote } from '#/types/misskey-js.types.js';
import { ApiErrorCode } from '#/types/result.types.js';
import { MisskeyJsWrapper } from '#/client/utils/api-wrappers.js';
import {
	DriverBookmarkStateResult,
	DriverLikeStateResult,
} from '#/types/driver.types.js';
import { getHumanReadableError } from '#/utils/errors.js';
import { errorBuilder, LibraryPromise } from '#/types/index.js';
import { PaginatedPromise } from '#/types/api-response.js';

type RenoteCreateDTO = {
	localOnly: boolean;
	renoteId: string;
	visibility: 'followers';
};

export class MisskeyStatusesRouter implements StatusesRoute {
	direct: FetchWrapper;
	client: MisskeyJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MisskeyJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async create(
		dto: DhaagaJsPostCreateDto,
	): Promise<Endpoints['notes/create']['res']> {
		try {
			return this.client.client.request<
				// @ts-ignore-next-line
				Endpoints['notes/create']['req'],
				any
			>('notes/create', {
				// ...dto,
				lang: dto.language,
				visibility: dto.misskeyVisibility,
				replyId: dto.inReplyToId,
				text: dto.status,
				visibleUserIds:
					dto.misskeyVisibility === 'specified'
						? dto.visibleUserIds || []
						: undefined,
				fileIds: dto.mediaIds.length > 0 ? dto.mediaIds || [] : undefined,
				cw: dto.spoilerText || undefined,
				localOnly: false, // reactionAcceptance: null,
				poll: dto.poll || null,
				scheduledAt: null, // cw: dto.spoilerText || null,
			}) as any;
		} catch (e: any) {
			throw new Error(getHumanReadableError(e));
		}
	}

	async delete(id: string): Promise<{ success: boolean; deleted: boolean }> {
		try {
			// @ts-ignore-next-line
			await this.client.client.request('notes/delete', {
				noteId: id,
			});
			return { success: true, deleted: true };
		} catch (e: any) {
			if (e.code) {
				return { success: false, deleted: false };
			}
			return { success: false, deleted: false };
		}
	}

	async getPost(id: string): Promise<MissNote> {
		return this.client.client.request('notes/show', { noteId: id });
	}

	async getReactions(
		postId: string,
	): Promise<Endpoints['notes/reactions']['res']> {
		return this.client.client.request('notes/reactions', {
			noteId: postId,
		});
	}

	async getReactionDetails(
		postId: string,
		reactionId: string,
	): LibraryPromise<any> {
		try {
			const data = await this.client.client.request('notes/reactions', {
				noteId: postId,
				type: reactionId, // limit: 20,
			});
			return { data };
		} catch (e) {
			return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	/**
	 * @param postId
	 * @param reactionId in full format --> e.g. :ultraigyo@.:
	 */
	async addReaction(
		postId: string,
		reactionId: string,
	): LibraryPromise<{ success: true; reacted: true; id: string }> {
		try {
			await this.client.client.request('notes/reactions/create', {
				noteId: postId,
				reaction: reactionId,
			});
			return { data: { success: true, reacted: true, id: reactionId } };
		} catch (e: any) {
			if (e.code) return errorBuilder(e);
			console.log('[ERROR]: failed to add reaction', reactionId, e);
			return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	async removeReaction(
		postId: string,
		reactionId: string,
	): LibraryPromise<{
		success: false;
		reacted: false;
		id: string;
	}> {
		try {
			await this.client.client.request('notes/reactions/delete', {
				noteId: postId,
				reaction: reactionId,
			});
			return { data: { success: false, reacted: false, id: reactionId } };
		} catch (e: any) {
			if (e.code) return errorBuilder(e);
			console.log('[ERROR]: failed to remove reaction', reactionId, e);
			return errorBuilder(ApiErrorCode.UNKNOWN_ERROR);
		}
	}

	async getState(id: string): LibraryPromise<Endpoints['notes/state']['res']> {
		try {
			const data = await this.client.client.request('notes/state', {
				noteId: id,
			});
			return { data };
		} catch (e: any) {
			if (e.code) {
				return errorBuilder(e);
			}
			console.log(e);
			return errorBuilder(ApiErrorCode.UNAUTHORIZED);
		}
	}

	async bookmark(id: string): DriverBookmarkStateResult {
		try {
			await this.client.client.request('notes/favorites/create', {
				noteId: id,
			});
			return { state: true };
		} catch (e: any) {
			throw new Error(getHumanReadableError(e));
		}
	}

	async unBookmark(id: string): DriverBookmarkStateResult {
		try {
			await this.client.client.request('notes/favorites/delete', {
				noteId: id,
			});
			return { state: false };
		} catch (e: any) {
			throw new Error(getHumanReadableError(e));
		}
	}

	async renotes(id: string): LibraryPromise<Endpoints['notes/renotes']['res']> {
		try {
			const data = await this.client.client.request('notes/renotes', {
				noteId: id,
			});
			return { data };
		} catch (e: any) {
			if (e.code) {
				return errorBuilder(e);
			}
			console.log(e);
			return errorBuilder(ApiErrorCode.UNAUTHORIZED);
		}
	}

	/**
	 * a.k.a. like -- applicable for Sharkey only
	 * @param id
	 */
	async favourite(id: string): Promise<{
		success: boolean;
		isFavourited: true;
	}> {
		try {
			await this.direct.post('/api/notes/like', { noteId: id }, {});
			return { success: true, isFavourited: true };
		} catch (e: any) {
			throw new Error(getHumanReadableError(e));
		}
	}

	/**
	 * a.k.a. like -- applicable for Sharkey only
	 * @param id
	 */
	async like(id: string): DriverLikeStateResult {
		try {
			await this.direct.post('/api/notes/like', { noteId: id }, {});
			return { state: true };
		} catch (e) {
			throw new Error(getHumanReadableError(e));
		}
	}

	async removeLike(id: string): DriverLikeStateResult {
		throw new Error('Method not implemented.');
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
			const data = await this.client.client.request('notes/create', dto);
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
			return errorBuilder(ApiErrorCode.UNAUTHORIZED);
		}
	}

	async unrenote(id: string): LibraryPromise<{
		success: true;
		renoted: false;
	}> {
		try {
			await this.client.client.request('notes/unrenote', {
				noteId: id,
			});
			return { data: { success: true, renoted: false } };
		} catch (e: any) {
			if (e.code) {
				return errorBuilder(e);
			}
			console.log(e);
			return errorBuilder(ApiErrorCode.UNAUTHORIZED);
		}
	}

	async getPostContext(id: string, limit?: number): Promise<MissContext> {
		const parents = this.client.client.request('notes/conversation', {
			noteId: id,
			limit: limit || 40,
		});
		const children = this.client.client.request('notes/children', {
			noteId: id,
			showQuotes: false,
			limit: limit || 40,
		});

		return new Promise((resolve, reject) => {
			Promise.all([parents, children])
				.then(([_parents, _children]) => {
					resolve({
						ancestors: _parents,
						descendants: _children,
					});
				})
				.catch((e) => {
					throw new Error(getHumanReadableError(e));
				});
		});
	}

	async getLikedBy(id: string): PaginatedPromise<any> {
		return {
			data: [],
		};
	}

	/**
	 * Try to use the current renote count as limit
	 * @param id
	 * @param limit
	 */
	async getSharedBy(
		id: string,
		limit?: number,
	): PaginatedPromise<Endpoints['notes/renotes']['res']> {
		const renotes = await this.client.client.request('notes/renotes', {
			noteId: id,
			limit,
		});
		return {
			data: renotes,
		};
	}

	async getQuotedBy(id: string) {
		return { data: [] };
	}
}
