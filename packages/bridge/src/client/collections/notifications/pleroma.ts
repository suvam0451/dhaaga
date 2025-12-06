import { NotificationGetQueryDto, NotificationsRoute } from './_interface.js';
import { CasingUtil } from '#/utils/casing.js';
import { MegaConversation, MegaNotification } from '#/types/megalodon.types.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MegalodonPleromaWrapper } from '#/client/utils/api-wrappers.js';
import { MastoGroupedNotificationsResults } from '#/types/mastojs.types.js';
import { PaginatedPromise } from '#/types/api-response.js';

export class PleromaNotificationsRouter implements NotificationsRoute {
	direct: FetchWrapper;
	pleromaClient: MegalodonPleromaWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.pleromaClient = MegalodonPleromaWrapper.create(
			forwarded.baseUrl,
			forwarded.token,
		);
	}

	async getAllNotifications(
		query: NotificationGetQueryDto,
	): PaginatedPromise<MegaNotification[]> {
		const data = await this.pleromaClient.client.getNotifications(
			CasingUtil.snakeCaseKeys(query),
		);
		return {
			data: data.data,
			maxId: undefined,
			minId: undefined,
		};
	}

	/**
	 * Pleroma/Akkoma have not implemented grouped notifications
	 */
	async getChats(): PaginatedPromise<MegaConversation[]> {
		const data = await this.pleromaClient.client.getConversationTimeline();
		return {
			data: data.data,
		};
	}

	async getChat(): PaginatedPromise<any> {
		throw new Error('method not implemented');
	}

	async getChatMessages(): PaginatedPromise<any> {
		throw new Error('method not implemented');
	}

	async getMentions(
		query: NotificationGetQueryDto,
	): PaginatedPromise<MastoGroupedNotificationsResults> {
		let url =
			'/api/v1/notifications' +
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
			'/api/v1/notifications' +
			'?exclude_types[]=follow_request' +
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
		let url = '/api/v1/notifications' + '?types[]=status';

		if (query.limit) url += '&limit=' + query.limit;
		if (query.maxId) url += '&max_id=' + query.maxId;

		const result =
			await this.direct.getCamelCaseWithLinkPagination<MastoGroupedNotificationsResults>(
				url,
			);
		return { data: result.data };
	}

	async sendMessage() {
		throw new Error('method not implemented');
	}
}
