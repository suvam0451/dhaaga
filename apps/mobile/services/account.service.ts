import { ActivityPubClient } from '@dhaaga/bridge';

class AccountService {
	static loadFollowedTags(db: any, client: ActivityPubClient) {
		client.tags.followedTags({ limit: 200 }).then(({ data, error }) => {
			if (error) {
				console.log('[ERROR]: failed to fetch followed tags', error);
				return;
			}
		});
	}
}

export default AccountService;
