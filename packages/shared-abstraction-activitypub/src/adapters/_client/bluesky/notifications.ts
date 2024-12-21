import {
	NotificationGetQueryDto,
	NotificationsRoute,
} from '../_router/routes/notifications.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { MastoNotification, MegaNotification } from '../_interface.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';

class BlueskyNotificationsRouter implements NotificationsRoute {
	get(query: NotificationGetQueryDto): LibraryPromise<{
		data: MastoNotification[] | MegaNotification[];
		minId?: string | null;
		maxId?: string | null;
	}> {
		return Promise.resolve({ data: undefined }) as any;
	}

	async getChats() {
		//blob.cat/api/v1/conversations

		return notImplementedErrorBuilder();
	}

	async getMentions() {
		return notImplementedErrorBuilder();
	}
}

export default BlueskyNotificationsRouter;
