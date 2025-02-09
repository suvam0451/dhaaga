import {
	NotificationGetQueryDto,
	NotificationsRoute,
} from '../_router/routes/notifications.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import {
	errorBuilder,
	notImplementedErrorBuilder,
} from '../_router/dto/api-responses.dto.js';
import { KNOWN_SOFTWARE } from '../_router/routes/instance.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import {
	MastoConversation,
	MastoGroupedNotificationsResults,
	MastoNotification,
} from '../../../types/mastojs.types.js';
import {
	DhaagaErrorCode,
	LibraryResponse,
} from '../../../types/result.types.js';
import { MastoJsWrapper } from '../../../custom-clients/custom-clients.js';
import {
	MegaConversation,
	MegaNotification,
} from '../../../types/megalodon.types.js';

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

	async get(query: NotificationGetQueryDto): Promise<
		LibraryResponse<{
			data: MastoNotification[] | MegaNotification[];
			minId?: string | null;
			maxId?: string | null;
		}>
	> {
		const { excludeTypes, types, ...rest } = query;

		if (types && types!.length > 0) {
			(rest as any)['types[]'] = types!.join(';');
		}

		const { data: _data, error } =
			await this.direct.getCamelCaseWithLinkPagination<MastoNotification[]>(
				'/api/v1/notifications',
				rest,
			);

		if (error || !_data) {
			return notImplementedErrorBuilder<{
				data: MastoNotification[];
				minId: string | null;
				maxId: string | null;
			}>();
		}

		return { data: _data };
	}

	async getMentions(query: NotificationGetQueryDto): Promise<
		LibraryResponse<{
			data: MastoGroupedNotificationsResults;
			minId?: string | null;
			maxId?: string | null;
		}>
	> {
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

		const result =
			await this.direct.getCamelCaseWithLinkPagination<MastoGroupedNotificationsResults>(
				url,
			);
		if (result.error) return errorBuilder();
		return { data: result.data };
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

		const result =
			await this.direct.getCamelCaseWithLinkPagination<MastoGroupedNotificationsResults>(
				url,
			);
		if (result.error) return errorBuilder();
		return { data: result.data };
	}

	async getSubscriptionUpdates(query: NotificationGetQueryDto) {
		let url = '/api/v2/notifications' + '?types[]=status';

		if (query.limit) url += '&limit=' + query.limit;
		if (query.maxId) url += '&max_id=' + query.maxId;

		const result =
			await this.direct.getCamelCaseWithLinkPagination<MastoGroupedNotificationsResults>(
				url,
			);
		if (result.error) return errorBuilder();
		return { data: result.data };
	}

	/**
	 * a.k.a. - conversations
	 */
	async getChats(): LibraryPromise<MastoConversation[] | MegaConversation[]> {
		try {
			const data = await this.mastoClient.lib.v1.conversations.list();
			return { data };
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

	async markChatRead(id: string): LibraryPromise<MastoConversation> {
		try {
			const data = await this.mastoClient.lib.v1.conversations
				.$select(id)
				.read();
			return { data };
		} catch (e) {
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async markChatUnread(id: string): LibraryPromise<MastoConversation> {
		try {
			const data = await this.mastoClient.lib.v1.conversations
				.$select(id)
				.unread();
			return { data };
		} catch (e) {
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async markChatRemove(id: string): LibraryPromise<void> {
		try {
			const data = await this.mastoClient.lib.v1.conversations
				.$select(id)
				.remove();
			return { data };
		} catch (e) {
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async sendMessage() {
		return notImplementedErrorBuilder();
	}
}
