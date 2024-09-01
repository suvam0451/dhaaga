import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	DhaagaJsPostCreateDto,
	StatusesRoute,
} from '../_router/routes/statuses.js';
import { DhaagaErrorCode, LibraryResponse } from '../_router/_types.js';
import {
	MastoScheduledStatus,
	MastoStatus,
	MegaReaction,
	MegaStatus,
} from '../_interface.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import {
	COMPAT,
	DhaagaMegalodonClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import { KNOWN_SOFTWARE } from '../_router/routes/instance.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import camelcaseKeys from 'camelcase-keys';

export class PleromaStatusesRouter implements StatusesRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MEGALODON>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMegalodonClient(
			KNOWN_SOFTWARE.PLEROMA,
			this.client.url,
			this.client.accessToken,
		);
	}

	async get(id: string): Promise<LibraryResponse<MastoStatus>> {
		const response = await this.lib.client.getStatus(id);
		if (response.status !== 200) {
			console.log('[ERROR]: failed to get status', response.statusText);
		}
		return {
			data: camelcaseKeys(response.data) as any,
		};
	}

	async create(
		dto: DhaagaJsPostCreateDto,
	): LibraryPromise<MastoScheduledStatus> {
		const response = await this.lib.client.postStatus(dto.status, {
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

		return { data: camelcaseKeys(response.data, { deep: true }) as any };
	}

	async delete(id: string): LibraryPromise<{ success: true }> {
		const data = await this.lib.client.deleteStatus(id);
		if (data.status === 200 || data.status === 204) {
			return { data: { success: true } };
		}
		return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
	}

	/**
	 * Pleroma specific stuff
	 */

	async getReactions(id: string): Promise<LibraryResponse<MegaReaction[]>> {
		const data = await this.lib.client.getEmojiReactions(id);
		return { data: camelcaseKeys(data.data, { deep: true }) as any };
	}

	async getReactionDetails(
		postId: string,
		reactionId: string,
	): LibraryPromise<MegaReaction[]> {
		const data = await this.lib.client.getEmojiReaction(postId, reactionId);
		if (data.status !== 200) {
			console.log('[ERROR]: failed to get reaction details', data.statusText);
			return errorBuilder<MegaReaction[]>(data.statusText);
		}
		return { data: camelcaseKeys(data.data) as any };
	}

	async addReaction(id: string, shortCode: string): LibraryPromise<any> {
		const data = await this.lib.client.createEmojiReaction(id, shortCode);
		if (data.status !== 200) {
			console.log('[ERROR]: failed to add reaction', data.statusText);
			return errorBuilder(data.statusText);
		}
		return { data: camelcaseKeys(data.data, { deep: true }) as any };
	}

	async removeReaction(id: string, shortCode: string): LibraryPromise<any> {
		const data = await this.lib.client.deleteEmojiReaction(id, shortCode);
		if (data.status !== 200) {
			console.log('[ERROR]: failed to remove reaction', data.statusText);
			return errorBuilder(data.statusText);
		}
		return { data: camelcaseKeys(data.data, { deep: true }) };
	}

	async bookmark(id: string) {
		const data = await this.lib.client.bookmarkStatus(id);
		return { data: data.data };
	}

	async unBookmark(id: string) {
		const data = await this.lib.client.unbookmarkStatus(id);
		return { data: data.data };
	}

	async like(id: string) {
		// const { data, error } = await new AppApi(
		// 	this.client.url,
		// 	this.client.accessToken,
		// ).post(`/api/v1/statuses/${id}/favourite`, {}, {});
		const data = await this.lib.client.favouriteStatus(id);
		return { data: data as any };
	}

	async removeLike(id: string) {
		const data = await this.lib.client.unfavouriteStatus(id);
		return { data: data.data };
	}

	async getContext(id: string) {
		const data = await this.lib.client.getStatusContext(id);
		return { data: camelcaseKeys(data.data) };
	}

	async boost(id: string): LibraryPromise<MegaStatus> {
		const data = await this.lib.client.reblogStatus(id);
		return { data: data.data };
	}

	async removeBoost(id: string): LibraryPromise<MegaStatus> {
		const data = await this.lib.client.unreblogStatus(id);
		return { data: data.data };
	}
}
