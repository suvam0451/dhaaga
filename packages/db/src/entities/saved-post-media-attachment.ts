import { RepoTemplate } from './_base.repo';
import { AccountSavedPost, SavedPostMediaAttachment } from '../_schema';
import { DataSource } from '../dataSource';
import { RandomUtil, type PostMediaAttachmentType } from '@dhaaga/bridge';

class Repo implements RepoTemplate<SavedPostMediaAttachment> {}

class Service {
	/**
	 * Upsert media objects for a post
	 * @param db
	 * @param savedPost
	 * @param medias
	 */
	static syncMediaAttachmentsForSavedPost(
		db: DataSource,
		savedPost: AccountSavedPost,
		medias: PostMediaAttachmentType[],
	) {
		const allMediaAttachments = db.savedPostMediaAttachment.find({
			savedPostId: savedPost.id,
		});

		const touched = new Set();

		for (const media of medias) {
			const match = allMediaAttachments.find((o) => o.url === media.url);
			if (match) {
				touched.add(match.id);
				try {
					db.savedPostMediaAttachment.updateById(match.id, {
						previewUrl: media.previewUrl,
						url: media.url,
						alt: media.alt,
						height: media.height,
						width: media.width,
						mimeType: media.type,
						active: true,
						savedPostId: savedPost.id,
					});
				} catch (e) {
					console.log('[WARN]: update attempt failed', e, media);
				}
			} else {
				db.savedPostMediaAttachment.insert({
					uuid: RandomUtil.nanoId(),
					previewUrl: media.previewUrl,
					url: media.url,
					alt: media.alt,
					height: media.height,
					width: media.width,
					mimeType: media.type,
					active: true,
					savedPostId: savedPost.id,
				});
			}
		}

		for (const mediaAttachment of allMediaAttachments) {
			if (!touched.has(mediaAttachment.id)) {
				db.savedPostMediaAttachment.updateById(mediaAttachment.id, {
					active: false,
				});
			}
		}
	}
}

export {
	Repo as SavedPostMediaAttachmentRepo,
	Service as SavedPostMediaAttachmentService,
};
