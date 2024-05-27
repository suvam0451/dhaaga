import Realm, {BSON, ObjectSchema} from 'realm';
import {ActivityPubUser} from "./activityPub";

export class ActivityPubServer extends Realm.Object {
  _id: Realm.BSON.UUID;
  description!: string;
  url: string
  type: string
  createdAt: Date
  // relations
  users: Realm.List<ActivityPubUser>

  static schema: ObjectSchema = {
    name: "ActivityPubServer",
    primaryKey: "_id",
    properties: {
      _id: "uuid",
      description: "string",
      url: "string",
      type: "string",
      createdAt: {
        type: "date",
        default: new Date()
      },

      // relations
      users: 'ActivityPubUser[]',
    }
  }
}
