import { Realm } from '@realm/react';
import {
	ActivitypubStatusAdapter,
	ActivityPubUserAdapter,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import type { mastodon } from '@dhaaga/shared-provider-mastodon';
import { ActivityPubConversationRepository } from '../repositories/activitypub-conversation.repo';
import { ActivityPubUserRepository } from '../repositories/activitypub-user.repo';
import { ActivityPubStatusRepository } from '../repositories/activitypub-status.repo';
import { ActivityPubServerRepository } from '../repositories/activitypub-server.repo';
import { ActivityPubChatroomRepository } from '../repositories/activitypub-chatroom.repo';
import { ActivityPubConversation } from '../entities/activitypub-conversation.entity';
import { UpdateMode } from 'realm';

class ChatroomService {
	static upsertConversation(
		db: Realm,
		{
			hash,
			me,
			conversation,
			domain,
			subdomain,
		}: {
			hash: string;
			me: UserInterface;
			conversation: mastodon.v1.Conversation;
			domain: string;
			subdomain: string;
		},
	) {
		const latest = ActivitypubStatusAdapter(conversation.lastStatus, domain);
		const usersI = conversation.accounts.map((o) =>
			ActivityPubUserAdapter(o, domain),
		);
		const conflict = ActivityPubConversationRepository.findById(
			db,
			conversation.id,
		);

		db.write(() => {
			const savedMe = ActivityPubUserRepository.upsert(db, {
				user: me,
				userSubdomain: subdomain,
			});
			const savedLatestStatus = ActivityPubStatusRepository.upsert(db, {
				status: latest,
				domain,
				subdomain,
			});
			const savedServer = ActivityPubServerRepository.upsert(
				db,
				me.getInstanceUrl(),
			);

			const savedParticipants = ActivityPubUserRepository.upsertMultiple(db, {
				users: usersI,
				userSubdomain: subdomain,
			});
			const savedChatroom = ActivityPubChatroomRepository.upsert(db, {
				hash,
				me,
			});
			const savedConversation = db.create(
				ActivityPubConversation,
				{
					_id: conflict?._id || new Realm.BSON.UUID(),
					conversationId: conversation.id,
					me: savedMe,
					latestStatus: savedLatestStatus,
					hash,
					server: savedServer,
					unread: conversation.unread,
					participants: savedParticipants,
				},
				UpdateMode.Modified,
			);

			ActivityPubChatroomRepository.addConversation(
				db,
				savedChatroom,
				savedConversation,
			);
			ActivityPubChatroomRepository.updateParticipants(
				db,
				savedChatroom,
				savedParticipants,
			);
		});
	}
}

export default ChatroomService;
