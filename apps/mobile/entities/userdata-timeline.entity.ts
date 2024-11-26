// import { ObjectSchema, Object } from 'realm';

export class UserDataTimeline extends Object {
	// _id: Realm.BSON.UUID;
	/**
	 * Full list of types of timelines supported are:
	 *
	 * - Home
	 * - Local
	 * - Federated
	 * - Remote
	 * - Hashtag
	 * - Hashtags
	 * - User
	 */
	type: string;
	pinned: boolean;
	/**
	 * Stores soft reference (as JSON) to the configuration
	 *
	 * This will be useful, if the FK references accidentally
	 * get deleted
	 *
	 * - Remote --> domain name (e.g. - mastodon.social)
	 * - Hashtag --> just the name
	 * - Hashtags --> names as CSV
	 * - USer --> @username@instance (e.g.- @suvam@mastodon.social)
	 */
	saveData: string;

	createdAt: Date;
	updatedAt: Date;

	// static schema: ObjectSchema = {
	// 	name: 'UserDataTimeline',
	// 	primaryKey: '_id',
	// 	properties: {
	// 		_id: 'uuid',
	// 		type: 'string',
	// 		pinned: { type: 'bool', default: false },
	// 		saveData: 'string',
	// 		createdAt: {
	// 			type: 'date',
	// 			default: new Date(),
	// 		},
	// 		updatedAt: 'date',
	// 	},
	// };
}
