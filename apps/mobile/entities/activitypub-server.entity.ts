import { BSON, ObjectSchema, Object } from 'realm';
import { ActivityPubUser } from './activitypub-user.entity';
import { ActivityPubStatus } from './activitypub-status.entity';
import { ActivityPubCustomEmojiItem } from './activitypub-emoji.entity';

export type ActivityPubServerCreateDTO = {
	description: string;
	url: string;
	type: string;
};

export class ActivityPubServer extends Object {
	_id: Realm.BSON.UUID;
	description!: string;
	url: string;
	type: string;
	customEmojisLastFetchedAt: Date;
	createdAt: Date;
	// relations
	users: Realm.List<ActivityPubUser>;
	statuses: Realm.List<ActivityPubStatus>;
	emojis: Realm.List<ActivityPubCustomEmojiItem>;

	static schema: ObjectSchema = {
		name: 'ActivityPubServer',
		primaryKey: '_id',
		properties: {
			_id: 'uuid',
			description: 'string',
			url: 'string',
			type: 'string',
			customEmojisLastFetchedAt: { type: 'date', optional: true },
			createdAt: {
				type: 'date',
				default: new Date(),
			},
			// relations
			users: 'ActivityPubUser[]',
			statuses: 'ActivityPubStatus[]',
			emojis: 'ActivityPubCustomEmojiItem[]',
		},
	};
}
