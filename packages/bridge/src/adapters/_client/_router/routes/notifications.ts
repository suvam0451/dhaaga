import { LibraryPromise } from './_types.js';
import { MastoNotification } from '../../../../types/mastojs.types.js';
import { MegaNotification } from '../../../../types/megalodon.types.js';
import { Facet } from '@atproto/api';
import {
	DriverNotificationType,
	KNOWN_SOFTWARE,
} from '../../../../data/driver.js';

export type NotificationGetQueryDto = {
	limit: number;
	minId?: string;
	maxId?: string; // doubles as untilId for misskey
	accountId?: string; // restrict to notifications recieved from this account
	types?: DriverNotificationType[];
	excludeTypes?: DriverNotificationType[];
	markAsRead?: boolean; // misskey
	excludeType?: string[];
	includeType?: string[];
};

export type Pleroma_Notification_Type = '';

export interface NotificationsRoute {
	get(query: NotificationGetQueryDto): LibraryPromise<{
		data: MastoNotification[] | MegaNotification[];
		minId?: string | null;
		maxId?: string | null;
	}>;

	getMentions(query: NotificationGetQueryDto): LibraryPromise<any>;

	getChats(driver: KNOWN_SOFTWARE): LibraryPromise<any>;

	getSocialUpdates(query: NotificationGetQueryDto): LibraryPromise<any>;

	getChat(roomId: string): LibraryPromise<any>;

	getMessages(roomId: string): LibraryPromise<any>;

	/**
	 * Supporting text-only replies for now
	 * @param convoId
	 * @param content
	 */
	sendMessage(
		convoId: string,
		content: { text?: string; facets?: Facet[] },
	): LibraryPromise<any>;

	// e,g. of how to get new notifs
	// https://blob.cat/api/v1/notifications?since_id=2455610&with_muted=true&limit=20
}
