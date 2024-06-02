import Realm, {ObjectSchema} from "realm";
import {ActivityPubConversation} from "./activitypub-conversation.entity";
import {ActivityPubUser} from "./activitypub-user.entity";
import {ENTITY} from "./_entities";

export class ActivityPubChatRoom extends Realm.Object {
  _id: Realm.BSON.UUID;
  hash: string
  // relations
  participants!: Realm.List<ActivityPubUser>;
  me?: ActivityPubUser;
  conversations: Realm.List<ActivityPubConversation>;
  // meta
  createdAt: Date = new Date()

  static primaryKey = '_id';
  static schema: ObjectSchema = {
    name: "ActivityPubChatRoom",
    primaryKey: "_id",
    properties: {
      _id: "uuid",
      hash: "string",

      // relations
      participants: 'ActivityPubUser[]',
      me: `${ENTITY.ACTIVITYPUB_USER}?`,
      conversations: `${ENTITY.ACTIVITYPUB_CONVERSATION}[]`,

      // meta
      createdAt: {
        type: "date",
        default: new Date()
      },
    }
  }
}