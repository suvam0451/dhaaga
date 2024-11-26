export class ActivityPubMediaAttachment extends Object {
	// _id: Realm.BSON.UUID;
	altText?: string;
	blurhash?: string;
	attachmentId: string;
	previewUrl?: string;
	url?: string;
	type: string;
	height: number;
	width: number;
	// previewCacheKey: Realm.BSON.UUID; // thumb is saved locally

	createdAt: Date;
}
