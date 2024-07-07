import { Realm } from '@realm/react';
import {
	ActivitypubStatusAdapter,
	ActivityPubUserAdapter,
	UserInterface,
} from '@dhaaga/shared-abstraction-activitypub';
import type { mastodon } from '@dhaaga/shared-provider-mastodon';
import { ActivityPubStatusRepository } from './activitypub-status.repo';
import { ActivityPubConversation } from '../entities/activitypub-conversation.entity';
import { ActivityPubUserRepository } from './activitypub-user.repo';
import { ActivityPubServerRepository } from './activitypub-server.repo';
import { ActivityPubChatroomRepository } from './activitypub-chatroom.repo';
import { UpdateMode } from 'realm';

export class ActivityPubConversationRepository {
	static clearAll(db: Realm) {
		db.delete(db.objects(ActivityPubConversation));
	}

	static add(
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
		const conflict = this.findById(db, conversation.id);

		const savedMe = ActivityPubUserRepository.upsert(db, { user: me });
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
		});
		const savedChatroom = ActivityPubChatroomRepository.upsert(db, {
			hash,
			me,
		});
		try {
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
		} catch (e) {
			console.log('[ERROR]: conversation db', e);
			return null;
		}
	}

	static findById(db: Realm, id: string) {
		return db
			.objects(ActivityPubConversation)
			.find((o) => o.conversationId === id);
	}
}
