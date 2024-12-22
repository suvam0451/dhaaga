import {
	NotificationGetQueryDto,
	NotificationsRoute,
} from '../_router/routes/notifications.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import { DhaagaErrorCode, LibraryResponse } from '../_router/_types.js';
import {
	MastoConversation,
	MastoGroupedNotificationsResults,
	MastoNotification,
} from '../_interface.js';
import {
	COMPAT,
	DhaagaMastoClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import AppApi from '../../_api/AppApi.js';
import {
	errorBuilder,
	notImplementedErrorBuilder,
} from '../_router/dto/api-responses.dto.js';
import { KNOWN_SOFTWARE } from '../_router/routes/instance.js';
import { LibraryPromise } from '../_router/routes/_types.js';

export class MastodonNotificationsRouter implements NotificationsRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MASTOJS>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMastoClient(this.client.url, this.client.accessToken);
	}

	async get(query: NotificationGetQueryDto): Promise<
		LibraryResponse<{
			data: MastoNotification[];
			minId?: string | null;
			maxId?: string | null;
		}>
	> {
		const { excludeTypes, types, ...rest } = query;

		if (types.length > 0) {
			(rest as any)['types[]'] = types.join(';');
		}

		const { data: _data, error } = await new AppApi(
			this.client.url,
			this.client.accessToken,
		).getCamelCaseWithLinkPagination<MastoNotification[]>(
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

	async getMentions(driver: KNOWN_SOFTWARE): Promise<
		LibraryResponse<{
			data: MastoGroupedNotificationsResults;
			minId?: string | null;
			maxId?: string | null;
		}>
	> {
		const { data: _data, error } = await new AppApi(
			this.client.url,
			this.client.accessToken,
		).getCamelCaseWithLinkPagination<MastoGroupedNotificationsResults>(
			'/api/v2/notifications' +
				'?grouped_types[]=favourite&grouped_types[]=reblog' +
				'&grouped_types[]=follow&exclude_types[]=follow' +
				'&exclude_types[]=follow_request&exclude_types[]=favourite' +
				'&exclude_types[]=reblog&exclude_types[]=poll' +
				'&exclude_types[]=status&exclude_types[]=update' +
				'&exclude_types[]=admin.sign_up&exclude_types[]=admin.report' +
				'&exclude_types[]=moderation_warning' +
				'&exclude_types[]=severed_relationships' +
				'&exclude_types[]=annual_report',
		);
		if (error) {
			return errorBuilder();
		}
		return { data: _data };
	}

	/**
	 * a.k.a. - conversations
	 * @param driver
	 */
	async getChats(driver: KNOWN_SOFTWARE): LibraryPromise<MastoConversation[]> {
		try {
			const data = await this.lib.client.v1.conversations.list();
			return { data };
		} catch (e) {
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async markChatRead(id: string): LibraryPromise<MastoConversation> {
		try {
			const data = await this.lib.client.v1.conversations.$select(id).read();
			return { data };
		} catch (e) {
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async markChatUnread(id: string): LibraryPromise<MastoConversation> {
		try {
			const data = await this.lib.client.v1.conversations.$select(id).unread();
			return { data };
		} catch (e) {
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async markChatRemove(id: string): LibraryPromise<void> {
		try {
			const data = await this.lib.client.v1.conversations.$select(id).remove();
			return { data };
		} catch (e) {
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}
}
