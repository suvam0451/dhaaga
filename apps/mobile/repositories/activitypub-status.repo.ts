import { ActivityPubServerRepository } from './activitypub-server.repo';
import { ActivityPubUserAdapter, StatusInterface } from '@dhaaga/bridge';
import { ActivityPubUserRepository } from './activitypub-user.repo';
import { ActivityPubStatusUpsertDTOType } from '../entities/activitypub-status.entity';
import { SQLiteDatabase } from 'expo-sqlite';

export class ActivityPubStatusRepository {
	static upsert(
		db: SQLiteDatabase,
		{
			status,
			subdomain,
			domain,
		}: { status: StatusInterface; subdomain: string; domain: string },
	) {
		const postedBy = ActivityPubUserAdapter(status.getUser(), domain);

		const payload: ActivityPubStatusUpsertDTOType = {
			url: status.getAccountUrl(subdomain),
			statusId: status.getId(),
			bookmarked: status.getIsBookmarked(),
			boostedCount: status.getRepostsCount(),
			content: status.getContent(),
			createdAt: status.getCreatedAt()
				? new Date(status.getCreatedAt())
				: new Date(),
			editedAt: status.getCreatedAt()
				? new Date(status.getCreatedAt())
				: new Date(),
			favourited: status.getIsFavourited(),
			reblogged: status.isReposted(),
			repliedCount: status.getRepliesCount(),
			replyToStatusId: null,
			replyToAcctId: null,
			sensitive: false,
			spoilerText: '',
			visibility: status.getVisibility() || 'unknown',
		};

		const match = this.find(db, status.getId(), subdomain);
		const savedServer = ActivityPubServerRepository.upsert(db, subdomain);
		const savedPostedBy = ActivityPubUserRepository.upsert(db, {
			user: postedBy,
			userSubdomain: subdomain,
		});

		// const retval = db.create(
		// 	ActivityPubStatus,
		// 	{
		// 		_id: match?._id || new Realm.BSON.UUID(),
		// 		...payload,
		// 		server: savedServer,
		// 		postedBy: savedPostedBy,
		// 	},
		// 	UpdateMode.Modified,
		// );

		/**
		 * Update Hashtag list
		 */
		// while (retval.hashtags.length > 0) retval.hashtags.pop();
		// const hashtags = TextParserService.findHashtags(payload.content);
		// for (const hashtag of hashtags) {
		// 	const savedTag = ActivityPubTagRepository.upsertByName(db, hashtag);
		// 	retval.hashtags.push(savedTag);
		// }

		/**
		 * Update Media Attachment list
		 */
		// while (retval.mediaAttachments.length > 0) {
		// 	const l = retval.mediaAttachments.pop();
		// 	// db.delete(l);
		// }
		const mediaI = status.getMediaAttachments();

		try {
			// for (const media of mediaI) {
			// 	const savedMedia = ActivityPubMediaAttachmentRepository.create(
			// 		db,
			// 		media,
			// 	);
			// 	retval.mediaAttachments.push(savedMedia);
			// }
		} catch (e) {
			// FIX: media attachment could be null in some cases
			console.log('[WARN]: failed to cache bookmark', status.getId());
		}

		// return retval;
	}

	/**
	 * Find a locally saved status, within a subdomain
	 * @param db
	 * @param statusId
	 * @param subdomain
	 */
	static find(db: SQLiteDatabase, statusId: string, subdomain: string) {
		// return db
		// 	.objects(ActivityPubStatus)
		// 	.find(
		// 		(o) =>
		// 			o.statusId === statusId &&
		// 			o?.server !== null &&
		// 			o?.server?.url === subdomain,
		// 	);
	}
}
