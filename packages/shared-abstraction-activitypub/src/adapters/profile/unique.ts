import { mastodon } from "@dhaaga/shared-provider-mastodon/src";
import { UserDetailed } from "@dhaaga/shared-provider-misskey/src";

export class UserDetailedInstance {
	instance: UserDetailed;
	constructor(instance: UserDetailed) {
		this.instance = instance;
	}
}

export class AccountInstance {
	instance: mastodon.v1.Account;
	constructor(instance: mastodon.v1.Account) {
		this.instance = instance;
	}
}
