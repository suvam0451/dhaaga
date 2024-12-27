import { BasePubSubService } from './_base.pubisher';

export enum APP_EVENT_ENUM {
	ACCOUNT_LIST_CHANGED = 'accountListChanged',
}

export class AppPublisherService extends BasePubSubService {}
