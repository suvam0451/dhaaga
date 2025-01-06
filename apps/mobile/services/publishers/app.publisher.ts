import { BasePubSubService } from './_base.pubisher';

export enum APP_EVENT_ENUM {
	ACCOUNT_LIST_CHANGED = 'accountListChanged',
	PROFILE_LIST_CHANGED = 'profileListChanged',
	PROFILE_VISIBILITY_CHANGED = 'profileVisibilityChanged',
}

export class AppPublisherService extends BasePubSubService {}
