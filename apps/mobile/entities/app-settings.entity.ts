import { ObjectSchema, Object } from 'realm';

export class AppSetting extends Object {
	_id: Realm.BSON.UUID;
	key: string;
	value: string;
	createdAt?: Date;
	updatedAt?: Date;
}
