import Realm, {BSON, ObjectSchema} from 'realm';
import {ActivityPubServer} from "./activityPubServer";

export class ActivityPubUser extends Realm.Object {
  _id: BSON.ObjectId = new BSON.ObjectId();
  userId: string //
  username: string // suvam
  accountId: string // suvam@mastodon.social
  server?: ActivityPubServer


  static schema: Realm.ObjectSchema = {
    name: "ActivityPubUser",
    primaryKey: "_id",
    properties: {
      _id: "uuid",
      userId: "string",
      username: "string",
      accountId: "string",
      // relations
      server: "ActivityPubServer?"
    }
  }
}

export class ActivityPubChatRoom extends Realm.Object {
  _id: BSON.ObjectId = new BSON.ObjectId();
  hash: string
// relations
  participants!: Realm.List<ActivityPubUser>;

  createdAt: Date = new Date()

  static primaryKey = '_id';
  static schema: ObjectSchema = {
    name: "ActivityPubChatRoom",
    primaryKey: "_id",
    properties: {
      _id: "uuid",
      hash: "string",
      createdAt: {
        type: "date",
        default: new Date()
      },

      // relations
      participants: 'ActivityPubUser[]'
    }
  }
}