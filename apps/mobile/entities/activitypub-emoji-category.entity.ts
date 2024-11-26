// import { ObjectSchema, Object } from 'realm';
import { ActivityPubCustomEmojiItem } from './activitypub-emoji.entity';
import { ENTITY } from './_entities';

export class ActivityPubCustomEmojiCategory extends Object {
	_id: Realm.BSON.UUID;
	name: string;
	emojis: Realm.List<ActivityPubCustomEmojiItem>;

	// static schema: ObjectSchema = {
	// 	name: 'ActivityPubCustomEmojiCategory',
	// 	primaryKey: '_id',
	//
	// 	properties: {
	// 		_id: 'uuid',
	// 		name: 'string',
	//
	// 		// relations
	// 		emojis: `${ENTITY.ACTIVITYPUB_CUSTOM_EMOJI_ITEM}[]`,
	// 	},
	// };
}
