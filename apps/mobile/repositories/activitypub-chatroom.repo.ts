import {Realm} from "@realm/react"
import {UserInterface} from "@dhaaga/shared-abstraction-activitypub/src";
import {ActivityPubChatRoom} from "../entities/activitypub-chatroom.entity";
import {ActivityPubUserRepository} from "./activitypub-user.repo";
import {
  ActivityPubConversation
} from "../entities/activitypub-conversation.entity";
import {ActivityPubUser} from "../entities/activitypub-user.entity";

export class ActivityPubChatroomRepository {
  static clearAll(db: Realm) {
    try {
      db.write(() => {
        db.delete(db.objects(ActivityPubChatRoom))
      })
    } catch (e) {
      console.log("[ERROR]: clearing entity table", e)
    }
  }

  static addConversation(db: Realm,
      target: ActivityPubChatRoom,
      item: ActivityPubConversation) {
    const _json = target?.conversations.toJSON()

    // Q: Why is this find function not matching?
    const conflict = _json.find((o) => o._id.toString() === item._id.toString())
    if (conflict) return conflict

    return db.write(() => {
      target.conversations.push(item)
    })
  }

  static updateParticipants(db: Realm,
      chatroom: ActivityPubChatRoom,
      list: ActivityPubUser[]) {
    db.write(() => {
      while (chatroom.participants.length > 0) {
        chatroom.participants.pop()
      }
      for (let i = 0; i < list.length; i++) {
        chatroom.participants.push(list[i])
      }
    })
  }

  static upsert(db: Realm, {hash, me}: { hash: string, me: UserInterface }) {
    const match = this.find(db, {hash, me})
    if (match) return match

    const savedMe = ActivityPubUserRepository.upsert(db, {user: me})
    if (!savedMe) {
      console.log("[WARN]: user not saved", savedMe)
      return null
    }

    return db.write(() => {
      return db.create(ActivityPubChatRoom, {
        _id: new Realm.BSON.UUID(),
        hash,
        me: savedMe,
        conversations: [],
        createdAt: new Date(),
        participants: []
      })
    })
  }

  static find(db: Realm, {hash, me}: { hash: string, me: UserInterface }) {
    return db.objects(ActivityPubChatRoom).find(
        (o) => o.hash === hash && o?.me?.userId === me.getId())
  }
}