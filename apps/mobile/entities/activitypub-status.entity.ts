import { ActivityPubUser } from './activitypub-user.entity';
import { z } from 'zod';
import { ActivityPubMediaAttachment } from './activitypub-media-attachment.entity';

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
	// _id: Realm.BSON.UUID;
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
	// server?: ActivityPubServer;
	mediaAttachments: ActivityPubMediaAttachment[];
}
