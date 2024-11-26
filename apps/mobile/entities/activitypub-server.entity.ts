import { ActivityPubUser } from './activitypub-user.entity';
import { ActivityPubStatus } from './activitypub-status.entity';
import { ActivityPubCustomEmojiItem } from './activitypub-emoji.entity';

export type ActivityPubServerCreateDTO = {
	description: string;
	url: string;
	type: string;
};

export class ActivityPubServer extends Object {
	_id: Realm.BSON.UUID;
	description!: string;
	url: string;
	type: string;
	nodeinfo?: string;
	// rate limit policies
	customEmojisRetryCount: number;

	// cache policy
	customEmojisLastFetchedAt?: Date;
	instanceSoftwareLastFetchedAt?: Date;
	// metadata
	createdAt: Date;

	// relations
	users: Realm.List<ActivityPubUser>;
	statuses: Realm.List<ActivityPubStatus>;
	emojis: Realm.List<ActivityPubCustomEmojiItem>;
}
