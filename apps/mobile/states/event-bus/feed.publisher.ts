import { EventBus } from '@dhaaga/bridge';
import { KNOWN_SOFTWARE, ApiTargetInterface } from '@dhaaga/bridge';
import type { FeedObjectType } from '@dhaaga/bridge';

export enum FEED_EVENT_ENUM {
	UPDATE = 'feedObjectChanged',
}

export class FeedPublisherService extends EventBus {
	private readonly cache: Map<string, FeedObjectType>;
	private readonly driver: KNOWN_SOFTWARE;
	private readonly client: ApiTargetInterface;
}
