import {
	NotificationGetQueryDto,
	NotificationsRoute,
} from '../_router/routes/notifications.js';
import { KNOWN_SOFTWARE } from '../_router/routes/instance.js';
import { toSnakeCase } from '../_router/utils/casing.utils.js';
import {
	errorBuilder,
	notImplementedErrorBuilder,
} from '../_router/dto/api-responses.dto.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import {
	MegaConversation,
	MegaNotification,
} from '../../../types/megalodon.types.js';
import {
	DhaagaErrorCode,
	LibraryResponse,
} from '../../../types/result.types.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { MegalodonPleromaWrapper } from '../../../custom-clients/custom-clients.js';
import { MastoGroupedNotificationsResults } from '../../../types/mastojs.types.js';
import { MastodonNotificationsRouter } from '../mastodon/notifications.js';

export class PleromaNotificationsRouter
	extends MastodonNotificationsRouter
	implements NotificationsRoute
{
	direct: FetchWrapper;
	pleromaClient: MegalodonPleromaWrapper;

	constructor(forwarded: FetchWrapper) {
		super(forwarded);
		this.direct = forwarded;
		this.pleromaClient = MegalodonPleromaWrapper.create(
			forwarded.baseUrl,
			forwarded.token,
		);
	}

	async get(query: NotificationGetQueryDto): Promise<
		LibraryResponse<{
			data: MegaNotification[];
			minId?: string | null;
			maxId?: string | null;
		}>
	> {
		const data = await this.pleromaClient.client.getNotifications(
			toSnakeCase(query),
		);
		return {
			data: {
				data: data.data,
				maxId: undefined,
				minId: undefined,
			},
		};
	}

	/**
	 * Pleroma/Akkoma have not implemented grouped notifications
	 */
	async getChats(): LibraryPromise<MegaConversation[]> {
		try {
			const data = await this.pleromaClient.client.getConversationTimeline();
			return {
				data: data.data,
			};
		} catch (e) {
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async getChat() {
		return notImplementedErrorBuilder();
	}

	async getMessages() {
		return notImplementedErrorBuilder();
	}

	async getMentions(query: NotificationGetQueryDto): Promise<
		LibraryResponse<{
			data: MastoGroupedNotificationsResults;
			minId?: string | null;
			maxId?: string | null;
		}>
	> {
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

		const result =
			await this.direct.getCamelCaseWithLinkPagination<MastoGroupedNotificationsResults>(
				url,
			);
		if (result.error) return errorBuilder();
		return { data: result.data };
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

		const result =
			await this.direct.getCamelCaseWithLinkPagination<MastoGroupedNotificationsResults>(
				url,
			);
		if (result.error) return errorBuilder();
		return { data: result.data };
	}

	async getSubscriptionUpdates(query: NotificationGetQueryDto) {
		let url = '/api/v1/notifications' + '?types[]=status';

		if (query.limit) url += '&limit=' + query.limit;
		if (query.maxId) url += '&max_id=' + query.maxId;

		const result =
			await this.direct.getCamelCaseWithLinkPagination<MastoGroupedNotificationsResults>(
				url,
			);
		if (result.error) return errorBuilder();
		return { data: result.data };
	}

	async sendMessage() {
		return notImplementedErrorBuilder();
	}
}
