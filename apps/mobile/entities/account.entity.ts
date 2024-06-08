import Realm, {ObjectSchema} from "realm";

export class KeyValuePair extends Realm.Object {
  _id: Realm.BSON.UUID;
  key: string
  value: string
  createdAt?: Date
  updatedAt?: Date

  static schema: ObjectSchema = {
    name: "KeyValuePair",
    primaryKey: "_id",

    properties: {
      _id: "uuid",
      key: "string",
      value: "string",
      createdAt: "date?",
      updatedAt: "date?"
    }
  }
}

export class Account extends Realm.Object {
  _id: Realm.BSON.UUID;
  domain: string // abstraction layer --> mastodon/misskey
  subdomain: string // instance --> mastodon.social/misskey.io
  username: string
  avatarUrl?: string
  password?: string
  createdAt: Date
  updatedAt: Date
  verified?: boolean
  settings: Realm.List<KeyValuePair>
  secrets: Realm.List<KeyValuePair>
  selected: boolean

  static schema: ObjectSchema = {
    name: "Account",
    primaryKey: "_id",

    properties: {
      _id: "uuid",
      domain: "string",
      subdomain: "string",
      username: "string",
      password: "string?",
      createdAt: "date",
      updatedAt: "date",
      verified: "bool?",
      settings: "KeyValuePair[]",
      secrets: "KeyValuePair[]",
      selected: {type: "bool", default: false},
    }
  }
}