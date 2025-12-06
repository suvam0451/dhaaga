import { RepoTemplate } from './_base.repo.js';
import { Account, AccountSavedPost } from '../_schema.js';
import { DataSource } from '../dataSource.js';
import { AccountSavedUserService } from './account-saved-user.js';
import { RandomUtil } from '@dhaaga/bridge';
import type { PostObjectType } from '@dhaaga/bridge/typings';
import { SavedPostMediaAttachmentService } from './saved-post-media-attachment.js';

class Repo implements RepoTemplate<AccountSavedPost> {}

class Service {
	static getByIdentifier(
		db: DataSource,
		acct: Account,
		identifier: string,
	): AccountSavedPost | null {
		return db.accountSavedPost.findOne({
			accountId: acct.id,
			identifier: identifier,
			active: true,
		});
	}

	static find(
		db: DataSource,
		acct: Account,
		id: string,
	): AccountSavedPost | null {
		return db.accountSavedPost.findOne({
			identifier: id,
			accountId: acct.id,
			active: true,
		});
	}

	static upsert(
		db: DataSource,
		acct: Account,
		post: PostObjectType,
	): AccountSavedPost | null {
		const postedBy = AccountSavedUserService.upsert(db, acct, post.postedBy);
		if (!postedBy) {
			console.log('[WARN]: failed to save postedBy info for post object');
			return null;
		}

		const conflict = db.accountSavedPost.findOne({
			accountId: acct.id,
			identifier: post.id,
		});

		if (conflict) {
			db.accountSavedPost.updateById(conflict.id, {
				textContent: post.content.raw,
				authoredAt: post.createdAt,
				spoilerText: post.meta.cw,
				sensitive: post.meta.sensitive,
				savedUserId: postedBy.id,
				active: true,
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

		if (savedPost) {
			// sync the media attachments for this post
			SavedPostMediaAttachmentService.syncMediaAttachmentsForSavedPost(
				db,
				savedPost,
				post.content.media,
			);
		}
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
				const item = valid.get(o.savedPostId!);
				if (item) {
					item.savedUser = users.get(item.savedUserId!);
					item.medias = allMediaAttachments.filter(
						(k) => k.savedPostId === o.id,
					);
					return item;
				}
				return null;
			})
			.filter((o) => !!o);
	}
}

export { Repo as AccountSavedPostRepo, Service as AccountSavedPostService };
