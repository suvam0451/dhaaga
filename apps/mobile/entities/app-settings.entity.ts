import Realm, {ObjectSchema} from "realm";

export class AppSetting extends Realm.Object {
  _id: Realm.BSON.UUID;
  key: string
  value: string
  createdAt?: Date
  updatedAt?: Date
}