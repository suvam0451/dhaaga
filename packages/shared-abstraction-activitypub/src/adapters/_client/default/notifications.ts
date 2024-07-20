import { NotificationsRoute } from '../_router/routes/notifications.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';
import { MastoNotification } from '../_interface.js';
import { LibraryResponse } from '../_router/_types.js';

export class DefaultNotificationsRouter implements NotificationsRoute {
	async get(): Promise<
		LibraryResponse<{
			data: MastoNotification[];
			minId?: string | null;
			maxId?: string | null;
		}>
	> {
		return notImplementedErrorBuilder<{
			data: MastoNotification[];
			minId?: string | null;
			maxId?: string | null;
		}>();
	}
}
