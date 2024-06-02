import Realm, {ObjectSchema} from "realm";
import {ActivityPubStatus} from "./activitypub-status.entity";
import {ActivityPubUser} from "./activitypub-user.entity";
import {ActivityPubServer} from "./activitypub-server.entity";
import {ActivityPubChatRoom} from "./activitypub-chatroom.entity";
import {ENTITY} from "./_entities";


export class ActivityPubConversation extends Realm.Object {
  _id: Realm.BSON.UUID;
  conversationId: string
  latestStatus: ActivityPubStatus
  participants!: Realm.List<ActivityPubUser>;
  hash: string
  unread: boolean
  me?: ActivityPubUser
  server?: ActivityPubServer
  chatroom!: ActivityPubChatRoom

  static primaryKey = '_id';
  static schema: ObjectSchema = {
    name: "ActivityPubConversation",
    primaryKey: "_id",
    properties: {
      _id: "uuid",
      conversationId: "string",
      latestStatus: `${ENTITY.ACTIVITYPUB_STATUS}?`,
      participants: `${ENTITY.ACTIVITYPUB_USER}[]`,
      me: `${ENTITY.ACTIVITYPUB_USER}?`,
      server: `${ENTITY.ACTIVITYPUB_SERVER}?`,
      chatroom: {
        type: 'linkingObjects',
        objectType: ENTITY.ACTIVITYPUB_CHATROOM,
        property: 'conversations',
      },
      hash: "string",
      unread: "bool"
    }
  }
}