import type {
	AppBskyNotificationListNotifications,
	ChatBskyConvoDefs,
	ChatBskyConvoGetMessages,
	ChatBskyConvoListConvos,
	Facet,
} from '@atproto/api';
import { NotificationGetQueryDto, NotificationsRoute } from './_interface.js';
import type { AppAtpSessionData } from '#/types/atproto.js';
import { getBskyAgent, getXrpcAgent } from '#/utils/atproto.js';
import { PaginatedPromise } from '#/types/api-response.js';

class BlueskyNotificationsRouter implements NotificationsRoute {
	dto: AppAtpSessionData;

	constructor(dto: AppAtpSessionData) {
		this.dto = dto;
	}

	async getAllNotifications(
		query: NotificationGetQueryDto,
	): PaginatedPromise<AppBskyNotificationListNotifications.Notification[]> {
		const agent = getXrpcAgent(this.dto);
		const response = await agent.listNotifications({ limit: query.limit });
		return {
			data: response.data.notifications,
			maxId: response.data.cursor,
		};
	}

	async getChats(): PaginatedPromise<ChatBskyConvoListConvos.OutputSchema> {
		const agent = getXrpcAgent(this.dto);
		const data = await agent.chat.bsky.convo.listConvos(
			{ limit: 10 },
			{ headers: { 'Atproto-Proxy': 'did:web:api.bsky.chat#bsky_chat' } },
		);

		return {
			data: data.data,
			maxId: data.data.cursor,
		};
	}

	async getChat(
		convoId: string,
	): PaginatedPromise<ChatBskyConvoDefs.ConvoView> {
		const agent = getXrpcAgent(this.dto);
		const data = await agent.chat.bsky.convo.getConvo(
			{ convoId },
			{
				headers: {
					'Atproto-Proxy': 'did:web:api.bsky.chat#bsky_chat',
				},
			},
		);
		return {
			data: data.data.convo,
		};
	}

	async getChatMessages(
		convoId: string,
	): PaginatedPromise<ChatBskyConvoGetMessages.OutputSchema> {
		const agent = getXrpcAgent(this.dto);
		const data = await agent.chat.bsky.convo.getMessages(
			{ convoId, limit: 60 },
			{
				headers: {
					'Atproto-Proxy': 'did:web:api.bsky.chat#bsky_chat',
				},
			},
		);
		return {
			data: data.data,
			maxId: data.data.cursor,
		};
	}

	async getMentions(): PaginatedPromise<
		AppBskyNotificationListNotifications.Notification[]
	> {
		const agent = getBskyAgent(this.dto);
		const response = await agent.listNotifications({
			reasons: ['mention', 'reply', 'quote'],
			limit: 30,
		});
		return {
			data: response.data.notifications,
			maxId: response.data.cursor,
		};
	}

	async sendMessage(
		convoId: string,
		content: { text: string; facets?: Facet[] },
	): Promise<ChatBskyConvoDefs.MessageView> {
		const agent = getXrpcAgent(this.dto);
		const response = await agent.chat.bsky.convo.sendMessage(
			{
				convoId,
				message: { text: content.text, facets: content.facets },
			},
			{
				headers: {
					'Atproto-Proxy': 'did:web:api.bsky.chat#bsky_chat',
				},
			},
		);
		return response.data;
	}

	async getSocialUpdates(
		query: NotificationGetQueryDto,
	): PaginatedPromise<AppBskyNotificationListNotifications.Notification[]> {
		const agent = getBskyAgent(this.dto);

		const resp = await agent.listNotifications({
			reasons: ['like', 'follow', 'repost'],
		});
		return {
			data: resp.data.notifications,
			maxId: resp.data.cursor,
		};
	}
}

export default BlueskyNotificationsRouter;
