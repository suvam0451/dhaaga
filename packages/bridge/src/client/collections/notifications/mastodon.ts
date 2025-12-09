import { NotificationGetQueryDto, NotificationsRoute } from './_interface.js';
import FetchWrapper from '#/client/utils/fetch.js';
import {
	MastoConversation,
	MastoGroupedNotificationsResults,
	MastoNotification,
} from '#/types/mastojs.types.js';
import { MastoJsWrapper } from '#/client/utils/api-wrappers.js';
import { PaginatedPromise } from '#/types/api-response.js';

export class MastodonNotificationsRouter implements NotificationsRoute {
	direct: FetchWrapper;
	mastoClient: MastoJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.mastoClient = MastoJsWrapper.create(
			forwarded.baseUrl,
			forwarded.token,
		);
	}

	async getAllNotifications(
		query: NotificationGetQueryDto,
	): PaginatedPromise<MastoNotification[]> {
		const { excludeTypes, types, ...rest } = query;

		if (types && types!.length > 0) {
			(rest as any)['types[]'] = types!.join(';');
		}

		return this.direct.getCamelCaseWithLinkPagination<MastoNotification[]>(
			'/api/v1/notifications',
			rest,
		);
	}

	async getMentions(
		query: NotificationGetQueryDto,
	): PaginatedPromise<MastoGroupedNotificationsResults> {
		let url =
			'/api/v2/notifications' +
			'?exclude_types[]=follow' +
			'&exclude_types[]=follow_request&exclude_types[]=favourite' +
			'&exclude_types[]=reblog&exclude_types[]=poll' +
			'&exclude_types[]=status&exclude_types[]=update' +
			'&exclude_types[]=admin.sign_up&exclude_types[]=admin.report' +
			'&exclude_types[]=moderation_warning' +
			'&exclude_types[]=severed_relationships' +
			'&exclude_types[]=annual_report';

		if (query.limit) url += '&limit=' + query.limit;
		if (query.maxId) url += '&max_id=' + query.maxId;

		return this.direct.getCamelCaseWithLinkPagination<MastoGroupedNotificationsResults>(
			url,
		);
	}

	async getSocialUpdates(query: NotificationGetQueryDto) {
		let url =
			'/api/v2/notifications' +
			'?grouped_types[]=reblog' +
			'&grouped_types[]=follow&exclude_types[]=follow_request' +
			'&exclude_types[]=poll' +
			'&exclude_types[]=status&exclude_types[]=update' +
			'&exclude_types[]=admin.sign_up&exclude_types[]=admin.report' +
			'&exclude_types[]=moderation_warning' +
			'&exclude_types[]=severed_relationships' +
			'&exclude_types[]=annual_report&exclude_types[]=mention';

		if (query.limit) url += '&limit=' + query.limit;
		if (query.maxId) url += '&max_id=' + query.maxId;

		return this.direct.getCamelCaseWithLinkPagination<MastoGroupedNotificationsResults>(
			url,
		);
	}

	async getSubscriptionUpdates(query: NotificationGetQueryDto) {
		let url = '/api/v2/notifications' + '?types[]=status';

		if (query.limit) url += '&limit=' + query.limit;
		if (query.maxId) url += '&max_id=' + query.maxId;

		return this.direct.getCamelCaseWithLinkPagination<MastoGroupedNotificationsResults>(
			url,
		);
	}

	/**
	 * a.k.a. - conversations
	 */
	async getChats(): PaginatedPromise<MastoConversation[]> {
		const data = await this.mastoClient.lib.v1.conversations.list();
		return {
			data,
		};
	}

	async getChat(): PaginatedPromise<any> {
		throw new Error('method not implemented');
	}

	async getChatMessages(): PaginatedPromise<any> {
		throw new Error('method not implemented');
	}

	async markChatAsRead(id: string): Promise<MastoConversation> {
		return await this.mastoClient.lib.v1.conversations.$select(id).read();
	}

	async markChatAsUnread(id: string): Promise<MastoConversation> {
		return await this.mastoClient.lib.v1.conversations.$select(id).unread();
	}

	async markChatRemove(id: string): Promise<void> {
		return await this.mastoClient.lib.v1.conversations.$select(id).remove();
	}

	async sendMessage() {
		throw new Error('method not implemented');
	}
}
