import {
	NotificationGetQueryDto,
	NotificationsRoute,
} from '../_router/routes/notifications.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { MastoNotification, MegaNotification } from '../_interface.js';

class BlueskyNotificationsRouter implements NotificationsRoute {
	get(query: NotificationGetQueryDto): LibraryPromise<{
		data: MastoNotification[] | MegaNotification[];
		minId?: string | null;
		maxId?: string | null;
	}> {
		return Promise.resolve({ data: undefined }) as any;
	}
}

export default BlueskyNotificationsRouter;
