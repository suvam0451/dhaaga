import { BasePubSubService } from './_base.pubisher';
import { KNOWN_SOFTWARE, ApiTargetInterface } from '@dhaaga/bridge';
import { PostMutator } from '../mutators/post.mutator';
import type { FeedObjectType } from '@dhaaga/bridge';

export enum FEED_EVENT_ENUM {
	UPDATE = 'feedObjectChanged',
}

export class FeedPublisherService extends BasePubSubService {
	private readonly cache: Map<string, FeedObjectType>;
	private readonly driver: KNOWN_SOFTWARE;
	private readonly client: ApiTargetInterface;
	private readonly mutator: PostMutator;
}
