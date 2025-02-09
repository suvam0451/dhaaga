import {
	DhaagaJsPostCreateDto,
	StatusesRoute,
} from '../_router/routes/statuses.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import {
	MegaReaction,
	MegaScheduledStatus,
	MegaStatus,
} from '../../../types/megalodon.types.js';
import { LibraryResponse } from '../../../types/result.types.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { MegalodonPleromaWrapper } from '../../../custom-clients/custom-clients.js';
import { CasingUtils } from '../../../utiils/casing.utils.js';

export class PleromaStatusesRouter implements StatusesRoute {
	direct: FetchWrapper;
	client: MegalodonPleromaWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MegalodonPleromaWrapper.create(
			forwarded.baseUrl,
			forwarded.token,
		);
	}

	async get(id: string): LibraryPromise<MegaStatus> {
		const response = await this.client.client.getStatus(id);
		if (response.status !== 200) {
			console.log('[ERROR]: failed to get status', response.statusText);
		}
		return {
			data: CasingUtils.camelCaseKeys(response.data),
		};
	}

	async create(
		dto: DhaagaJsPostCreateDto,
	): LibraryPromise<MegaStatus | MegaScheduledStatus> {
		const response = await this.client.client.postStatus(dto.status, {
			language: dto.language,
			visibility: dto.mastoVisibility,
			in_reply_to_id: dto.inReplyToId as any,
			sensitive: dto.sensitive,
			spoiler_text: dto.spoilerText,
			media_ids: dto.mediaIds || [],
		});
		if (response.status !== 200) {
			console.log('[ERROR]: failed to create status', response.statusText);
		}

		return { data: CasingUtils.camelCaseKeys(response.data) };
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

	async getReactions(id: string): Promise<LibraryResponse<MegaReaction[]>> {
		const data = await this.client.client.getEmojiReactions(id);
		return { data: CasingUtils.camelCaseKeys(data.data) };
	}

	async getReactionDetails(
		postId: string,
		reactionId: string,
	): LibraryPromise<MegaReaction[]> {
		const data = await this.client.client.getEmojiReactions(postId);
		if (data.status !== 200) {
			console.log('[ERROR]: failed to get reaction details', data.statusText);
			return errorBuilder<MegaReaction[]>(data.statusText);
		}
		return { data: CasingUtils.camelCaseKeys(data.data) };
	}

	async addReaction(id: string, shortCode: string): LibraryPromise<any> {
		const data = await this.client.client.createEmojiReaction(id, shortCode);
		if (data.status !== 200) {
			console.log('[ERROR]: failed to add reaction', data.statusText);
			return errorBuilder(data.statusText);
		}
		return { data: CasingUtils.camelCaseKeys(data.data) };
	}

	async removeReaction(id: string, shortCode: string): LibraryPromise<any> {
		const data = await this.client.client.deleteEmojiReaction(id, shortCode);
		if (data.status !== 200) {
			console.log('[ERROR]: failed to remove reaction', data.statusText);
			return errorBuilder(data.statusText);
		}
		return { data: CasingUtils.camelCaseKeys(data.data) };
	}

	async bookmark(id: string) {
		const data = await this.client.client.bookmarkStatus(id);
		return { data: data.data };
	}

	async unBookmark(id: string) {
		const data = await this.client.client.unbookmarkStatus(id);
		return { data: data.data };
	}

	async like(id: string) {
		// const { data, error } = await new AppApi(
		// 	this.client.url,
		// 	this.client.accessToken,
		// ).post(`/api/v1/statuses/${id}/favourite`, {}, {});
		const data = await this.client.client.favouriteStatus(id);
		return { data: data as any };
	}

	async removeLike(id: string) {
		const data = await this.client.client.unfavouriteStatus(id);
		return { data: data.data };
	}

	async getContext(id: string) {
		const data = await this.client.client.getStatusContext(id);
		return { data: CasingUtils.camelCaseKeys(data.data) };
	}

	async boost(id: string): LibraryPromise<MegaStatus> {
		const data = await this.client.client.reblogStatus(id);
		return { data: data.data };
	}

	async removeBoost(id: string): LibraryPromise<MegaStatus> {
		const data = await this.client.client.unreblogStatus(id);
		return { data: data.data };
	}
}
