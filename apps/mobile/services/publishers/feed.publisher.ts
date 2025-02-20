import { BasePubSubService } from './_base.pubisher';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import ActivityPubClient from '@dhaaga/bridge/dist/adapters/_client/_interface';
import { PostMutator } from '../mutators/post.mutator';
import type { FeedObjectType } from '@dhaaga/core';

export enum FEED_EVENT_ENUM {
	UPDATE = 'feedObjectChanged',
}

export class FeedPublisherService extends BasePubSubService {
	private readonly cache: Map<string, FeedObjectType>;
	private readonly driver: KNOWN_SOFTWARE;
	private readonly client: ActivityPubClient;
	private readonly mutator: PostMutator;
}
