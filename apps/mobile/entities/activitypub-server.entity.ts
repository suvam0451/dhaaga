export type ActivityPubServerCreateDTO = {
	description: string;
	url: string;
	type: string;
};

export class ActivityPubServer extends Object {
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
}
