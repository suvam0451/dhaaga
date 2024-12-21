import {
	NotificationGetQueryDto,
	NotificationsRoute,
} from '../_router/routes/notifications.js';
import {
	COMPAT,
	DhaagaMegalodonClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import { KNOWN_SOFTWARE } from '../_router/routes/instance.js';
import { DhaagaErrorCode, LibraryResponse } from '../_router/_types.js';
import { MegaConversation, MegaNotification } from '../_interface.js';
import { toSnakeCase } from '../_router/utils/casing.utils.js';
import {
	errorBuilder,
	notImplementedErrorBuilder,
} from '../_router/dto/api-responses.dto.js';
import { LibraryPromise } from '../_router/routes/_types.js';

export class PleromaNotificationsRouter implements NotificationsRoute {
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

	async get(query: NotificationGetQueryDto): Promise<
		LibraryResponse<{
			data: MegaNotification[];
			minId?: string | null;
			maxId?: string | null;
		}>
	> {
		const data = await this.lib.client.getNotifications(toSnakeCase(query));
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
	async getChats(driver: KNOWN_SOFTWARE): LibraryPromise<{
		data: MegaConversation[];
		minId?: string | null;
		maxId?: string | null;
	}> {
		try {
			const data = await this.lib.client.getConversationTimeline();
			return {
				data: {
					data: data.data,
					maxId: undefined,
					minId: undefined,
				},
			};
		} catch (e) {
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async getMentions() {
		return notImplementedErrorBuilder();
	}
}
