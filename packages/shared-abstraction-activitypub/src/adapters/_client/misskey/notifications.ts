import {
	NotificationGetQueryDto,
	NotificationsRoute,
} from '../_router/routes/notifications.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMisskeyClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import { LibraryResponse } from '../_router/_types.js';
import { MastoNotification } from '../_interface.js';
import type { Endpoints } from 'misskey-js/autogen/endpoint.js';

export class MisskeyNotificationsRouter implements NotificationsRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MISSKEYJS>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMisskeyClient(this.client.url, this.client.accessToken);
	}

	async get(query: NotificationGetQueryDto): Promise<
		LibraryResponse<{
			data: MastoNotification[];
			minId?: string | null;
			maxId?: string | null;
		}>
	> {
		const data = await this.lib.client.request<
			'i/notifications-grouped',
			Endpoints['i/notifications-grouped']['req']
		>('i/notifications-grouped', query as any);
		return { data: data as any };
	}
}
