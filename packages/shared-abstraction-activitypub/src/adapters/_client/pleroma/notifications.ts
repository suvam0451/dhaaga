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
import { LibraryResponse } from '../_router/_types.js';
import { MegaNotification } from '../_interface.js';
import { toSnakeCase } from '../_router/utils/casing.utils.js';

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
}
