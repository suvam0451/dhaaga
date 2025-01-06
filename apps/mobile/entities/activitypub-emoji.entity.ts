import { ActivityPubCustomEmojiCategory } from './activitypub-emoji-category.entity';

export type ActivityPubCustomEmojiItemDTO = {
	shortcode: string;
	url: string;
	staticUrl: string;
	visibleInPicker: boolean;
	category: string;
	aliases: string[];
};

export class ActivityPubCustomEmojiItem extends Object {
	// _id: Realm.BSON.UUID;

	shortcode: string;
	url: string;
	staticUrl: string;
	visibleInPicker: boolean;

	// aliases: Realm.List<string>;
	timesUsed: number;
	category?: ActivityPubCustomEmojiCategory;
	// server?: ActivityPubServer;

	// static schema: ObjectSchema = {
	// 	name: 'ActivityPubCustomEmojiItem',
	// 	primaryKey: '_id',
	// 	properties: {
	// 		_id: 'uuid',
	// 		shortcode: { type: 'string', indexed: true },
	// 		url: 'string',
	// 		staticUrl: 'string',
	// 		visibleInPicker: 'bool',
	// 		timesUsed: { type: 'int', default: 0 },
	// 		aliases: { type: 'list', objectType: 'string' },
	// 		category: {
	// 			type: 'linkingObjects',
	// 			objectType: ENTITY.ACTIVITYPUB_CUSTOM_EMOJI_CATEGORY,
	// 			property: 'emojis',
	// 		},
	// 		server: {
	// 			type: 'linkingObjects',
	// 			objectType: ENTITY.ACTIVITYPUB_SERVER,
	// 			property: 'emojis',
	// 		},
	// 	},
	// };
}
