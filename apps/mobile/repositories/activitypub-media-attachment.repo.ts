import { ActivityPubMediaAttachment } from '../entities/activitypub-media-attachment.entity';
import { MediaAttachmentInterface } from '@dhaaga/shared-abstraction-activitypub';
import { Realm } from 'realm';

export class ActivityPubMediaAttachmentRepository {
	static clearAll(db: Realm) {
		db.delete(db.objects(ActivityPubMediaAttachment));
	}

	static create(db: Realm, dto: MediaAttachmentInterface) {
		try {
			return db.create(ActivityPubMediaAttachment, {
				_id: new Realm.BSON.UUID(),
				attachmentId: dto.getId(),
				altText: dto.getAltText(),
				createdAt: dto.getCreatedAt()
					? new Date(dto.getCreatedAt())
					: new Date(),
				url: dto.getUrl(),
				previewCacheKey: new Realm.BSON.UUID(),
				previewUrl: dto.getPreviewUrl(),
				type: dto.getType(),
				height: dto.getHeight() || -1,
				width: dto.getWidth() || -1,
				blurhash: dto.getBlurHash(),
			});
		} catch (e) {
			console.log('[ERROR]: uploading media item', e);
			dto.print();
			return null;
		}
	}
}
