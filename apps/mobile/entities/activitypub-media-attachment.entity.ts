import { ObjectSchema, Object } from 'realm';

export class ActivityPubMediaAttachment extends Object {
	_id: Realm.BSON.UUID;
	altText?: string;
	blurhash?: string;
	attachmentId: string;
	previewUrl?: string;
	url?: string;
	type: string;
	height: number;
	width: number;
	previewCacheKey: Realm.BSON.UUID; // thumb is saved locally

	createdAt: Date;

	static schema: ObjectSchema = {
		name: 'ActivityPubMediaAttachment',
		primaryKey: '_id',
		properties: {
			_id: 'uuid',
			altText: 'string?',
			blurhash: 'string?',
			attachmentId: 'string',
			previewUrl: 'string?',
			url: 'string',
			type: 'string',
			height: 'int',
			width: 'int',
			previewCacheKey: 'uuid',
			createdAt: 'date',
		},
	};
}
