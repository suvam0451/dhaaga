import {
	NotificationGetQueryDto,
	NotificationsRoute,
} from '../_router/routes/notifications.js';
import type { Endpoints } from 'misskey-js/autogen/endpoint.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { KNOWN_SOFTWARE } from '../_router/routes/instance.js';
import { MastoNotification } from '../../../types/mastojs.types.js';
import { LibraryResponse } from '../../../types/result.types.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { MisskeyJsWrapper } from '../../../custom-clients/custom-clients.js';

export class MisskeyNotificationsRouter implements NotificationsRoute {
	direct: FetchWrapper;
	client: MisskeyJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MisskeyJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async get(query: NotificationGetQueryDto): Promise<
		LibraryResponse<{
			data: MastoNotification[];
			minId?: string | null;
			maxId?: string | null;
		}>
	> {
		const data = await this.client.client.request<
			'i/notifications-grouped',
			Endpoints['i/notifications-grouped']['req']
		>('i/notifications-grouped', query as any);
		return { data: { data: data as any } };
	}

	async getUngrouped(query: NotificationGetQueryDto): LibraryPromise<{
		data: MastoNotification[];
		minId?: string | null;
		maxId?: string | null;
	}> {
		const data = await this.client.client.request<
			'i/notifications',
			Endpoints['i/notifications']['req']
		>('i/notifications', query as any);
		return { data: { data: data as any } };
	}

	async getMentions(driver: KNOWN_SOFTWARE) {
		const data = await this.client.client.request<
			'notes/mentions',
			Endpoints['notes/mentions']['req']
		>('notes/mentions', {
			limit: 40,
		});
		return { data: { data: data as any } };
	}

	async getChats(driver: KNOWN_SOFTWARE) {
		const data = await this.client.client.request<
			'notes/mentions',
			Endpoints['notes/mentions']['req']
		>('notes/mentions', {
			limit: 40,
			visibility: 'specified',
		});
		return { data: { data: data as any } };
	}

	async getSocialUpdates(query: NotificationGetQueryDto) {
		const data = await this.client.client.request<
			'i/notifications-grouped',
			Endpoints['i/notifications-grouped']['req']
		>('i/notifications-grouped', query as any);
		return { data: { data: data as any } };
	}
}
