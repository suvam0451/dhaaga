import {
	NotificationGetQueryDto,
	NotificationsRoute,
} from '../_router/routes/notifications.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';
import { MastoNotification } from '../../../types/mastojs.types.js';
import { MegaNotification } from '../../../types/megalodon.types.js';
import { getBskyAgent, getXrpcAgent } from '../_router/_api.js';
import {
	AppBskyNotificationListNotifications,
	ChatBskyConvoGetConvo,
	ChatBskyConvoGetMessages,
	ChatBskyConvoListConvos,
} from '@atproto/api';
import { InvokeBskyFunction } from '../../../custom-clients/custom-bsky-agent.js';
import { AppAtpSessionData } from '../../../types/atproto.js';

class BlueskyNotificationsRouter implements NotificationsRoute {
	dto: AppAtpSessionData;

	constructor(dto: AppAtpSessionData) {
		this.dto = dto;
	}

	get(query: NotificationGetQueryDto): LibraryPromise<{
		data: MastoNotification[] | MegaNotification[];
		minId?: string | null;
		maxId?: string | null;
	}> {
		return Promise.resolve({ data: undefined }) as any;
	}

	async getChats(): LibraryPromise<ChatBskyConvoListConvos.OutputSchema> {
		const agent = getXrpcAgent(this.dto);
		return InvokeBskyFunction<ChatBskyConvoListConvos.OutputSchema>(
			'listConvos',
			agent.chat.bsky.convo.listConvos,
			agent.chat.bsky.convo,
			{
				limit: 10,
			},
			{
				headers: {
					'Atproto-Proxy': 'did:web:api.bsky.chat#bsky_chat',
				},
			},
		);
	}

	async getChat(
		convoId: string,
	): LibraryPromise<ChatBskyConvoGetConvo.OutputSchema> {
		const agent = getXrpcAgent(this.dto);
		return InvokeBskyFunction<ChatBskyConvoGetConvo.OutputSchema>(
			'getConvo',
			agent.chat.bsky.convo.getConvo,
			agent.chat.bsky.convo,
			{
				convoId,
			},
			{
				headers: {
					'Atproto-Proxy': 'did:web:api.bsky.chat#bsky_chat',
				},
			},
		);
	}

	async getMessages(
		convoId: string,
	): LibraryPromise<ChatBskyConvoGetMessages.OutputSchema> {
		const agent = getXrpcAgent(this.dto);
		return InvokeBskyFunction<ChatBskyConvoGetMessages.OutputSchema>(
			'getMessages',
			agent.chat.bsky.convo.getMessages,
			agent.chat.bsky.convo,
			{
				convoId,
				limit: 60,
			},
			{
				headers: {
					'Atproto-Proxy': 'did:web:api.bsky.chat#bsky_chat',
				},
			},
		);
	}

	async getMentions(): LibraryPromise<AppBskyNotificationListNotifications.OutputSchema> {
		const agent = getBskyAgent(this.dto);
		return await InvokeBskyFunction<AppBskyNotificationListNotifications.OutputSchema>(
			'listNotifications',
			agent.listNotifications,
			agent,
			{
				reasons: ['mention', 'reply', 'quote'],
				limit: 30,
			},
		);
	}

	async getSocialUpdates(query: NotificationGetQueryDto) {
		return notImplementedErrorBuilder();
	}
}

export default BlueskyNotificationsRouter;
