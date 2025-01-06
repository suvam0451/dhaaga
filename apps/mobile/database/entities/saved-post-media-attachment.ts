import { RepoTemplate } from './_base.repo';
import { AccountSavedPost, SavedPostMediaAttachment } from '../_schema';
import { DataSource } from '../dataSource';
import { AppMediaObject } from '../../types/app-post.types';
import { RandomUtil } from '../../utils/random.utils';

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
		medias: AppMediaObject[],
	) {
		const allMediaAttachments = db.savedPostMediaAttachment.find({
			savedPostId: savedPost.id,
		});

		const touched = new Set();

		for (const media of medias) {
			const match = allMediaAttachments.find((o) => o.url === media.url);
			if (match) {
				touched.add(match.id);
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
