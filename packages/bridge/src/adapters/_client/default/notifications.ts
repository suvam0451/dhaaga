import { NotificationsRoute } from '../_router/routes/notifications.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';
import { MastoNotification } from '../../../types/mastojs.types.js';
import { LibraryResponse } from '../../../types/result.types.js';

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

	async getChats() {
		return notImplementedErrorBuilder();
	}

	async getMentions() {
		return notImplementedErrorBuilder();
	}
}
