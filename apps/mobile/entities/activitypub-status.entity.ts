import { ObjectSchema, Object } from 'realm';
import { ActivityPubServer } from './activitypub-server.entity';
import { ActivityPubUser } from './activitypub-user.entity';
import { z } from 'zod';
import { ActivityPubMediaAttachment } from './activitypub-media-attachment.entity';
import { ENTITY } from './_entities';
import { ActivityPubTag } from './activitypub-tag.entity';

const ActivityPubStatusUpsertDTO = z.object({
	statusId: z.string(),
	content: z.string(),
	createdAt: z.date(),
	editedAt: z.date(),
	favourited: z.boolean(),
	bookmarked: z.boolean(),
	replyToAcctId: z.string(),
	replyToStatusId: z.string(),
	reblogged: z.boolean(),
	spoilerText: z.string(),
	visibility: z.string(),
	url: z.string(),
	boostedCount: z.number(),
	repliedCount: z.number(),
	sensitive: z.boolean(),
});

export type ActivityPubStatusUpsertDTOType = z.infer<
	typeof ActivityPubStatusUpsertDTO
>;

export class ActivityPubStatus extends Object {
	_id: Realm.BSON.UUID;
	statusId: string;
	content: string;
	createdAt: Date;
	editedAt: Date;
	favourited: boolean;
	bookmarked: boolean;
	privatelyBookmarked: boolean;
	replyToAcctId: string;
	replyToStatusId: string;
	reblogged: boolean;
	spoilerText: string;
	visibility: string;
	url: string; // e.g. - https://misskey.io/notes/xyz
	boostedCount: number;
	repliedCount: number;
	sensitive: boolean;

	postedBy?: ActivityPubUser;
	server?: ActivityPubServer;
	mediaAttachments: ActivityPubMediaAttachment[];
	hashtags: ActivityPubTag[];

	static schema: ObjectSchema = {
		name: 'ActivityPubStatus',
		primaryKey: '_id',
		properties: {
			_id: 'uuid',
			statusId: 'string',
			content: 'string?',
			createdAt: 'date',
			editedAt: 'date?',
			favourited: 'bool',
			bookmarked: 'bool',
			privatelyBookmarked: {
				type: 'bool',
				default: false,
			},
			replyToAcctId: 'string?',
			replyToStatusId: 'string?',
			reblogged: 'bool',
			spoilerText: 'string?',
			visibility: 'string',
			url: 'string',
			boostedCount: 'int',
			repliedCount: 'int',
			sensitive: 'bool',
			// relations
			server: `${ENTITY.ACTIVITYPUB_SERVER}?`,
			postedBy: `${ENTITY.ACTIVITYPUB_USER}?`,
			mediaAttachments: `${ENTITY.ACTIVITYPUB_MEDIA_ATTACHMENT}[]`,
			hashtags: `${ENTITY.ACTIVITYPUB_TAG}[]`,
		},
	};
}
