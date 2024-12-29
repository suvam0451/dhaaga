import {
	ActivitypubStatusAdapter,
	ActivityPubUserAdapter,
	UserInterface,
} from '@dhaaga/bridge';
import { ActivityPubConversationRepository } from '../repositories/activitypub-conversation.repo';
import { SQLiteDatabase } from 'expo-sqlite';

class ChatroomService {
	static upsertConversation(
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
		const conflict = ActivityPubConversationRepository.findById(
			db,
			conversation.id,
		);

		// db.write(() => {
		// 	const savedMe = ActivityPubUserRepository.upsert(db, {
		// 		user: me,
		// 		userSubdomain: subdomain,
		// 	});
		// 	const savedLatestStatus = ActivityPubStatusRepository.upsert(db, {
		// 		status: latest,
		// 		domain,
		// 		subdomain,
		// 	});
		// 	const savedServer = ActivityPubServerRepository.upsert(
		// 		db,
		// 		me.getInstanceUrl(),
		// 	);
		//
		// 	const savedParticipants = ActivityPubUserRepository.upsertMultiple(db, {
		// 		users: usersI,
		// 		userSubdomain: subdomain,
		// 	});
		// 	const savedChatroom = ActivityPubChatroomRepository.upsert(db, {
		// 		hash,
		// 		me,
		// 	});
		// 	// const savedConversation = db.create(
		// 	// 	ActivityPubConversation,
		// 	// 	{
		// 	// 		_id: conflict?._id || new Realm.BSON.UUID(),
		// 	// 		conversationId: conversation.id,
		// 	// 		me: savedMe,
		// 	// 		latestStatus: savedLatestStatus,
		// 	// 		hash,
		// 	// 		server: savedServer,
		// 	// 		unread: conversation.unread,
		// 	// 		participants: savedParticipants,
		// 	// 	},
		// 	// 	UpdateMode.Modified,
		// 	// );
		//
		// 	// ActivityPubChatroomRepository.addConversation(
		// 	// 	db,
		// 	// 	savedChatroom,
		// 	// 	savedConversation,
		// 	// );
		// 	ActivityPubChatroomRepository.updateParticipants(
		// 		db,
		// 		savedChatroom,
		// 		savedParticipants,
		// 	);
		// });
	}
}

export default ChatroomService;
