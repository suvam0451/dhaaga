import {
	ActivitypubStatusAdapter,
	ActivityPubUserAdapter,
	UserInterface,
} from '@dhaaga/bridge';
import { ActivityPubStatusRepository } from './activitypub-status.repo';
import { ActivityPubUserRepository } from './activitypub-user.repo';
import { ActivityPubServerRepository } from './activitypub-server.repo';
import { SQLiteDatabase } from 'expo-sqlite';

export class ActivityPubConversationRepository {
	static clearAll(db: SQLiteDatabase) {
		// db.delete(db.objects(ActivityPubConversation));
	}

	static add(
		db: SQLiteDatabase,
		{
			hash,
			me,
			conversation,
			domain,
			subdomain,
		}: {
			hash: string;
			me: UserInterface;
			conversation: any;
			domain: string;
			subdomain: string;
		},
	) {
		const latest = ActivitypubStatusAdapter(conversation.lastStatus, domain);
		const usersI = conversation.accounts.map((o) =>
			ActivityPubUserAdapter(o, domain),
		);
		const conflict = this.findById(db, conversation.id);

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

		// const savedParticipants = ActivityPubUserRepository.upsertMultiple(db, {
		// 	users: usersI,
		// 	userSubdomain: subdomain,
		// });
		// const savedChatroom = ActivityPubChatroomRepository.upsert(db, {
		// 	hash,
		// 	me,
		// });
		// try {
		// 	const savedConversation = db.create(
		// 		ActivityPubConversation,
		// 		{
		// 			_id: conflict?._id || new Realm.BSON.UUID(),
		// 			conversationId: conversation.id,
		// 			me: savedMe,
		// 			latestStatus: savedLatestStatus,
		// 			hash,
		// 			server: savedServer,
		// 			unread: conversation.unread,
		// 			participants: savedParticipants,
		// 		},
		// 		UpdateMode.Modified,
		// 	);
		// 	ActivityPubChatroomRepository.addConversation(
		// 		db,
		// 		savedChatroom,
		// 		savedConversation,
		// 	);
		// 	ActivityPubChatroomRepository.updateParticipants(
		// 		db,
		// 		savedChatroom,
		// 		savedParticipants,
		// 	);
		// } catch (e) {
		// 	console.log('[ERROR]: conversation db', e);
		// 	return null;
		// }
	}

	static findById(db: SQLiteDatabase, id: string) {
		// return db
		// 	.objects(ActivityPubConversation)
		// 	.find((o) => o.conversationId === id);
	}
}
