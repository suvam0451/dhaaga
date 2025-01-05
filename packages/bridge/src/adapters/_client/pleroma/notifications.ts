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

export class PleromaNotificationsRouter implements NotificationsRoute {
	direct: FetchWrapper;
	client: MegalodonPleromaWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MegalodonPleromaWrapper.create(
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
		const data = await this.client.client.getNotifications(toSnakeCase(query));
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
			const data = await this.client.client.getConversationTimeline();
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

	async getChat() {
		return notImplementedErrorBuilder();
	}

	async getMessages() {
		return notImplementedErrorBuilder();
	}

	async getMentions() {
		return notImplementedErrorBuilder();
	}

	async getSocialUpdates() {
		return notImplementedErrorBuilder();
	}
}
