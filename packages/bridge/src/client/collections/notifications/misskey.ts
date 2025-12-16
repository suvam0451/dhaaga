import { NotificationsRoute } from './_interface.js';
import type { Endpoints } from 'misskey-js/autogen/endpoint.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MisskeyJsWrapper } from '#/client/utils/api-wrappers.js';
import { KNOWN_SOFTWARE } from '#/client/utils/driver.js';
import { PaginatedPromise } from '#/types/api-response.js';
import { NotificationGetQueryDto } from '#/client/typings.js';

type MISSKEY_NOTIFICATION_TYPE =
	| 'note'
	| 'follow'
	| 'mention'
	| 'reply'
	| 'renote'
	| 'quote'
	| 'reaction'
	| 'pollEnded'
	| 'receiveFollowRequest'
	| 'followRequestAccepted'
	| 'roleAssigned'
	| 'achievementEarned'
	| 'exportCompleted'
	| 'login'
	| 'app'
	| 'test'
	| 'reaction:grouped'
	| 'renote:grouped'
	| 'pollVote'
	| 'groupInvited'
	| 'note:grouped'; // cherrypick

export class MisskeyNotificationsRouter implements NotificationsRoute {
	direct: FetchWrapper;
	client: MisskeyJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MisskeyJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async getAllNotifications(
		query: NotificationGetQueryDto,
	): PaginatedPromise<Endpoints['i/notifications-grouped']['res']> {
		const data = await this.client.client.request<
			'i/notifications-grouped',
			Endpoints['i/notifications-grouped']['req']
		>('i/notifications-grouped', query as any);
		return { data: data as any };
	}

	async getUngrouped(
		query: NotificationGetQueryDto,
	): PaginatedPromise<Endpoints['i/notifications']['res']> {
		const data = await this.client.client.request<
			'i/notifications',
			Endpoints['i/notifications']['req']
		>('i/notifications', query as any);
		return { data: data };
	}

	async getMentions(query: NotificationGetQueryDto) {
		const data = await this.client.client.request<
			'notes/mentions',
			Endpoints['notes/mentions']['req']
		>('notes/mentions', {
			limit: 40,
			untilId: query.maxId || undefined,
		});
		return { data: { data: data as any } };
	}

	async getChats(driver: KNOWN_SOFTWARE) {
		const data = await this.client.client.request<
			'notes/mentions',
			Endpoints['notes/mentions']['req']
		>('notes/mentions', {
			limit: 40,
			visibility: 'specified',
		});
		return { data: { data: data as any } };
	}

	async getChatDetails(): PaginatedPromise<any> {
		throw new Error('method not implemented');
	}

	async getChatMessages(): PaginatedPromise<any> {
		throw new Error('method not implemented');
	}

	async getSocialUpdates(query: NotificationGetQueryDto) {
		const data = await this.client.client.request<
			'i/notifications-grouped',
			Endpoints['i/notifications-grouped']['req']
		>('i/notifications-grouped', {
			limit: query.limit,
			untilId: query.maxId ?? undefined,
			includeTypes: [
				'follow',
				'followRequestAccepted',
				'receiveFollowRequest',
				'groupInvited',
				'reaction',
				'reaction:grouped',
				'renote',
				'renote:grouped',
			] as MISSKEY_NOTIFICATION_TYPE[] as any,
			excludeTypes: ['note:grouped'] as any,
		});
		return { data: { data: data as any } };
	}

	async getSubscriptions(maxId?: string) {
		const data = await this.client.client.request<
			'i/notifications-grouped',
			Endpoints['i/notifications-grouped']['req']
		>('i/notifications-grouped', {
			limit: 40,
			untilId: maxId ?? undefined,
			includeTypes: ['note'] as MISSKEY_NOTIFICATION_TYPE[] as any,
		});
		return { data: { data: data as any } };
	}

	async sendMessage() {
		throw new Error('method not implemented');
	}
}
