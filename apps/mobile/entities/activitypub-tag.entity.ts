import Realm, {ObjectSchema} from "realm";

export type ActivityPubTagCreateDTO = {
  name: string,
  following?: boolean,
  privatelyFollowing?: boolean
}

export class ActivityPubTag extends Realm.Object {
  _id: Realm.BSON.UUID;
  following: boolean
  name: string
  privatelyFollowing: boolean

  static schema: ObjectSchema = {
    name: "ActivityPubTag",
    primaryKey: "_id",
    properties: {
      _id: "uuid",
      following: {type: "bool", default: false},
      name: {type: "string", indexed: true},
      privatelyFollowing: {type: "bool", default: false},
    }
  }
}