import {
	NotificationGetQueryDto,
	NotificationsRoute,
} from '../_router/routes/notifications.js';

export class DefaultNotificationsRouter implements NotificationsRoute {
	async getAllNotifications(): Promise<any> {
		throw new Error('method not implemented');
	}

	async getChats(): Promise<any> {
		throw new Error('method not implemented');
	}

	async getChat(): Promise<any> {
		throw new Error('method not implemented');
	}

	async getChatMessages(): Promise<any> {
		throw new Error('method not implemented');
	}

	async sendMessage(): Promise<any> {
		throw new Error('method not implemented');
	}

	async getMentions(): Promise<any> {
		throw new Error('method not implemented');
	}

	async getSocialUpdates(query: NotificationGetQueryDto): Promise<any> {
		throw new Error('method not implemented');
	}
}
