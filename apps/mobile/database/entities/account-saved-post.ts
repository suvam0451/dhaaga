import { RepoTemplate } from './_base.repo';
import { Account, AccountSavedPost } from '../_schema';
import { AppPostObject } from '../../types/app-post.types';
import { DataSource } from '../dataSource';
import { AccountSavedUserService } from './account-saved-user';
import { RandomUtil } from '../../utils/random.utils';
import { SavedPostMediaAttachmentService } from './saved-post-media-attachment';

class Repo implements RepoTemplate<AccountSavedPost> {}

class Service {
	static getByIdentifier(
		db: DataSource,
		acct: Account,
		identifier: string,
	): AccountSavedPost {
		return db.accountSavedPost.findOne({
			accountId: acct.id,
			identifier: identifier,
			active: true,
		});
	}

	static find(db: DataSource, id: string): AccountSavedPost {
		return db.accountSavedPost.findOne({
			identifier: id,
			active: true,
		});
	}

	static upsert(
		db: DataSource,
		acct: Account,
		post: AppPostObject,
	): AccountSavedPost {
		const postedBy = AccountSavedUserService.upsert(db, acct, post.postedBy);
		if (!postedBy) {
			console.log('[WARN]: failed to save postedBy info for post object');
			return null;
		}

		const conflict = db.accountSavedPost.findOne({
			accountId: acct.id,
			identifier: post.id,
			active: true,
		});

		if (conflict) {
			db.accountSavedPost.updateById(conflict.id, {
				textContent: post.content.raw,
				authoredAt: post.createdAt,
				spoilerText: post.meta.cw,
				sensitive: post.meta.sensitive,
				savedUserId: postedBy.id,
			});
		} else {
			db.accountSavedPost.insert({
				uuid: RandomUtil.nanoId(),
				identifier: post.id,
				textContent: post.content.raw,
				authoredAt: post.createdAt,
				spoilerText: post.meta.cw,
				sensitive: post.meta.sensitive,
				accountId: acct.id,
				savedUserId: postedBy.id,
			});
		}

		const savedPost = db.accountSavedPost.findOne({
			active: true,
			accountId: acct.id,
			identifier: post.id,
		});

		// sync the media attachments for this post
		SavedPostMediaAttachmentService.syncMediaAttachmentsForSavedPost(
			db,
			savedPost,
			post.content.media,
		);
		return savedPost;
	}

	/**
	 * Get a list of saved posts for
	 * this collection
	 *
	 * also left joins savedPost
	 * @param db db reference
	 * @param collectionId id of collection
	 */
	static listForCollectionId(db: DataSource, collectionId: number) {
		const allSavedPosts = db.accountSavedPost.find({ active: true });
		const allSavedUsers = db.accountSavedUser.find({ active: true });
		const allMediaAttachments = db.savedPostMediaAttachment.find({
			active: true,
		});
		const refs = db.collectionSavedPost.find({
			active: true,
			collectionId,
		});
		const valid = new Map(allSavedPosts.map((obj) => [obj.id, obj]));
		const users = new Map(allSavedUsers.map((obj) => [obj.id, obj]));
		return refs
			.map((o) => {
				const item = valid.get(o.savedPostId);
				item.savedUser = users.get(item.savedUserId);
				item.medias = allMediaAttachments.filter((k) => k.savedPostId === o.id);
				return item;
			})
			.filter((o) => !!o);
	}
}

export { Repo as AccountSavedPostRepo, Service as AccountSavedPostService };
