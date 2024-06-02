import Realm, {BSON, ObjectSchema} from 'realm';
import {ActivityPubUser} from "./activitypub-user.entity";
import {ActivityPubStatus} from "./activitypub-status.entity";

export class ActivityPubServer extends Realm.Object {
  _id: Realm.BSON.UUID;
  description!: string;
  url: string
  type: string
  createdAt: Date
  // relations
  users: Realm.List<ActivityPubUser>
  statuses: Realm.List<ActivityPubStatus>

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
      statuses: "ActivityPubStatus[]"
    }
  }
}
