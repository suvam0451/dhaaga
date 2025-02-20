import { BasePubSubService } from './_base.pubisher';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import ActivityPubClient from '@dhaaga/bridge/dist/adapters/_client/_interface';
import { PostMutator } from '../mutators/post.mutator';
import { AppFeedObject } from '../../types/app-feed.types';

export enum FEED_EVENT_ENUM {
	UPDATE = 'feedObjectChanged',
}

export class FeedPublisherService extends BasePubSubService {
	private readonly cache: Map<string, AppFeedObject>;
	private readonly driver: KNOWN_SOFTWARE;
	private readonly client: ActivityPubClient;
	private readonly mutator: PostMutator;
}
