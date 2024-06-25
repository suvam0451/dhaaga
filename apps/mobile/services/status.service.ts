import { StatusInterface } from '@dhaaga/shared-abstraction-activitypub/src';
import { ActivityPubClient } from '@dhaaga/shared-abstraction-activitypub/src';
import { SetStateAction } from 'react';
import { mastodon } from '@dhaaga/shared-provider-mastodon/src';
import { Note } from '@dhaaga/shared-provider-misskey/src';

class StatusService {
	static async toggleBoost(
		client: ActivityPubClient,
		statusI: StatusInterface,
		{
			setIsLoading,
			setDataRaw,
		}: {
			setIsLoading: (value: SetStateAction<boolean>) => void;
			setDataRaw: (o: mastodon.v1.Status | Note) => void;
		},
	) {
		setIsLoading(true);
		if (statusI.getIsRebloggedByMe()) {
			return client
				.undoReblog(statusI.getId())
				.then((res) => {
					setDataRaw(res);
				})
				.catch(() => {
					throw new Error('Failed to undo reblog for status');
				})
				.finally(() => {
					setIsLoading(false);
				});
		} else {
			return client
				.reblog(statusI.getId())
				.then(async (res) => {
					// this is my reblogged status
					// console.log(res)
					await client
						.getStatus(statusI.getId())
						.then((res2) => {
							setDataRaw(res2);
						})
						.catch(() => {
							throw new Error('Failed to update status');
						});
				})
				.catch(() => {
					throw new Error('Failed to reblog status');
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}
}

export default StatusService;
