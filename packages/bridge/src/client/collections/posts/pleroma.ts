import { StatusesRoute } from './_interface.js';
import {
	MegaReaction,
	MegaScheduledStatus,
	MegaStatus,
} from '#/types/megalodon.types.js';
import FetchWrapper from '#/client/utils/fetch.js';
import {
	MastoJsWrapper,
	MegalodonPleromaWrapper,
} from '#/client/utils/api-wrappers.js';
import { CasingUtil } from '#/utils/casing.js';
import {
	DriverBookmarkStateResult,
	DriverLikeStateResult,
} from '#/types/driver.types.js';
import { getHumanReadableError } from '#/utils/errors.js';
import { PaginatedPromise } from '#/types/api-response.js';
import type { MastoAccount, MastoStatus } from '#/types/index.js';
import { DhaagaJsPostCreateDto } from '#/client/typings.js';

export class PleromaStatusesRouter implements StatusesRoute {
	direct: FetchWrapper;
	client: MegalodonPleromaWrapper;
	mastoClient: MastoJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MegalodonPleromaWrapper.create(
			forwarded.baseUrl,
			forwarded.token,
		);
		this.mastoClient = MastoJsWrapper.create(
			forwarded.baseUrl,
			forwarded.token,
		);
	}

	async getPost(id: string): Promise<MegaStatus> {
		const response = await this.client.client.getStatus(id);
		return CasingUtil.camelCaseKeys(response.data);
	}

	async create(
		dto: DhaagaJsPostCreateDto,
	): Promise<MegaStatus | MegaScheduledStatus> {
		const response = await this.client.client.postStatus(dto.status, {
			language: dto.language,
			visibility: dto.mastoVisibility,
			in_reply_to_id: dto.inReplyToId as any,
			sensitive: dto.sensitive,
			spoiler_text: dto.spoilerText,
			media_ids: dto.mediaIds || [],
		});
		return CasingUtil.camelCaseKeys(response.data);
	}

	async delete(id: string): Promise<{ success: boolean; deleted: boolean }> {
		const data = await this.client.client.deleteStatus(id);
		if (data.status === 200 || data.status === 204) {
			return { success: true, deleted: true };
		}
		return { success: false, deleted: false };
	}

	/**
	 * Pleroma specific stuff
	 */

	async getReactions(id: string): Promise<MegaReaction[]> {
		const data = await this.client.client.getEmojiReactions(id);
		return CasingUtil.camelCaseKeys(data.data);
	}

	async getReactionDetails(
		postId: string,
		reactionId: string,
	): Promise<MegaReaction[]> {
		const data = await this.client.client.getEmojiReactions(postId);
		return CasingUtil.camelCaseKeys(data.data);
	}

	async addReaction(id: string, shortCode: string): Promise<any> {
		const data = await this.client.client.createEmojiReaction(id, shortCode);
		return CasingUtil.camelCaseKeys(data.data);
	}

	async removeReaction(id: string, shortCode: string): Promise<any> {
		const data = await this.client.client.deleteEmojiReaction(id, shortCode);
		return CasingUtil.camelCaseKeys(data.data);
	}

	async bookmark(id: string): DriverBookmarkStateResult {
		const data = await this.client.client.bookmarkStatus(id);
		return { state: data.data.bookmarked };
	}

	async unBookmark(id: string): DriverBookmarkStateResult {
		const data = await this.client.client.unbookmarkStatus(id);
		return { state: data.data.bookmarked };
	}

	async like(id: string): DriverLikeStateResult {
		try {
			const data = await this.client.client.favouriteStatus(id);
			return {
				state: !!data.data.favourited,
				counter: data.data.favourites_count,
			};
		} catch (e) {
			throw new Error(getHumanReadableError(e));
		}
	}

	async removeLike(id: string): DriverLikeStateResult {
		try {
			const data = await this.client.client.unfavouriteStatus(id);
			return {
				state: !!data.data.favourited,
				counter: data.data.favourites_count,
			};
		} catch (e) {
			throw new Error(getHumanReadableError(e));
		}
	}

	async getPostContext(id: string) {
		const data = await this.client.client.getStatusContext(id);
		return CasingUtil.camelCaseKeys(data.data);
	}

	async boost(id: string): Promise<MegaStatus> {
		const data = await this.client.client.reblogStatus(id);
		return data.data;
	}

	async removeBoost(id: string): Promise<MegaStatus> {
		const data = await this.client.client.unreblogStatus(id);
		return data.data;
	}

	/**
	 * megalodon does not implement
	 * @param id
	 */
	async getLikedBy(id: string) {
		const data = await this.mastoClient.lib.v1.statuses
			.$select(id)
			.favouritedBy.list();
		return {
			data,
		};
	}

	async getSharedBy(id: string): PaginatedPromise<MastoAccount[]> {
		const data = await this.mastoClient.lib.v1.statuses
			.$select(id)
			.rebloggedBy.list();
		return {
			data,
		};
	}

	async getQuotedBy(id: string): PaginatedPromise<MastoStatus[]> {
		return {
			data: [],
		};
	}
}
