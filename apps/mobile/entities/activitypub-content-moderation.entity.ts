export class ActivityPubContentFilterRule extends Object {
	// _id: Realm.BSON.UUID;

	target: string; // displayName, username, account, application, instance,
	// accountDescription
	strategy: string; // exact, includes, regex
	value: string; // string to use
	caseSensitive: boolean;

	// static schema: ObjectSchema = {
	// 	name: 'ActivityPubContentFilterRule',
	// 	primaryKey: '_id',
	// 	properties: {
	// 		_id: 'uuid',
	// 		target: 'string',
	// 		strategy: 'string',
	// 		value: 'string',
	// 		caseSensitive: 'bool',
	// 	},
	// };
}
