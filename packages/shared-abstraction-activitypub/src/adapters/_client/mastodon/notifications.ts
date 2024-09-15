import {
	NotificationGetQueryDto,
	NotificationsRoute,
} from '../_router/routes/notifications.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import { LibraryResponse } from '../_router/_types.js';
import { MastoNotification } from '../_interface.js';
import {
	COMPAT,
	DhaagaMastoClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import AppApi from '../../_api/AppApi.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';

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
}
