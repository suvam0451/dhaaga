import { ActivityPubServer } from './activitypub-server.entity';
import { z } from 'zod';

export const ActivityPubUserCreateDTO = z.object({
	userId: z.string(),
	username: z.string(),
	accountId: z.string(),
});

export type ActivityPubUserCreateDTOType = z.infer<
	typeof ActivityPubUserCreateDTO
>;

export class ActivityPubUser
	extends Object
	implements ActivityPubUserCreateDTOType
{
	// _id: Realm.BSON.UUID;
	userId?: string; //
	username: string; // suvam
	accountId?: string; // suvam@mastodon.social
	avatarUrl?: string;
	displayName?: string;
	server?: ActivityPubServer;
}
