import { UserInterface } from '@dhaaga/bridge';
import { ActivityPubUser } from '../entities/activitypub-user.entity';
import { SQLiteDatabase } from 'expo-sqlite';
import { AppChatRoom } from '../services/chat.service';
import { AppMessageObject } from '../types/app-message.types';

export class ActivityPubChatroomRepository {
	static clearAll(db: SQLiteDatabase) {
		try {
			// db.delete(db.objects(ActivityPubChatRoom));
		} catch (e) {
			console.log('[ERROR]: clearing entity table', e);
		}
	}

	static addConversation(
		db: SQLiteDatabase,
		target: AppChatRoom,
		item: AppMessageObject,
	) {
		if (!target) {
			return;
		}
		// const _json = target?.conversations.toJSON();

		// Q: Why is this find function not matching?
		// const conflict = _json.find(
		// 	(o) => o._id.toString() === item._id.toString(),
		// );
		// if (conflict) return conflict;
		//
		// target.conversations.push(item);
	}

	static updateParticipants(
		db: SQLiteDatabase,
		chatroom: AppChatRoom,
		list: ActivityPubUser[],
	) {
		// while (chatroom.participants.length > 0) {
		// 	chatroom.participants.pop();
		// }
		// for (let i = 0; i < list.length; i++) {
		// 	chatroom.participants.push(list[i]);
		// }
	}

	static upsert(
		db: SQLiteDatabase,
		{ hash, me }: { hash: string; me: UserInterface },
	) {
		// const match = this.find(db, { hash, me });
		// if (match) return match;
		//
		// const savedMe = ActivityPubUserRepository.upsert(db, { user: me });
		// if (!savedMe) {
		// 	console.log('[WARN]: user not saved', savedMe, me);
		// 	return null;
		// }
		// return db.create(ActivityPubChatRoom, {
		// 	_id: new Realm.BSON.UUID(),
		// 	hash,
		// 	me: savedMe,
		// 	conversations: [],
		// 	createdAt: new Date(),
		// 	participants: [],
		// });
	}

	static find(
		db: SQLiteDatabase,
		{ hash, me }: { hash: string; me: UserInterface },
	) {
		// return db
		// 	.objects(ActivityPubChatRoom)
		// 	.find((o) => o.hash === hash && o?.me?.userId === me.getId());
	}
}
