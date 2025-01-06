import { BasePubSubService } from './_base.pubisher';

export enum APP_EVENT_ENUM {
	ACCOUNT_LIST_CHANGED = 'accountListChanged',
	PROFILE_LIST_CHANGED = 'profileListChanged',
}

export class AppPublisherService extends BasePubSubService {}
