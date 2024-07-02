import { ActivityPubMediaAttachment } from '../entities/activitypub-media-attachment.entity';
import { MediaAttachmentInterface } from '@dhaaga/shared-abstraction-activitypub/src';
import { Realm } from 'realm';

export class ActivityPubMediaAttachmentRepository {
	static clearAll(db: Realm) {
		db.delete(db.objects(ActivityPubMediaAttachment));
	}

	static create(db: Realm, dto: MediaAttachmentInterface) {
		return db.create(ActivityPubMediaAttachment, {
			_id: new Realm.BSON.UUID(),
			attachmentId: dto.getId(),
			altText: dto.getAltText(),
			createdAt: dto.getCreatedAt() ? new Date(dto.getCreatedAt()) : new Date(),
			url: dto.getUrl(),
			previewCacheKey: new Realm.BSON.UUID(),
			previewUrl: dto.getPreviewUrl(),
			type: dto.getType(),
			height: dto.getHeight(),
			width: dto.getWidth(),
			blurhash: dto.getBlurHash(),
		});
	}
}
