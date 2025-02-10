import { useAppApiClient } from '../../../../../hooks/utility/global-state-extractors';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { useQuery } from '@tanstack/react-query';
import { AppBskyFeedGetAuthorFeed } from '@atproto/api';
import { PostMiddleware } from '../../../../../services/middlewares/post.middleware';
import { AppPostObject } from '../../../../../types/app-post.types';

function useProfileGalleryModeInteractor(userId: string) {
	const { client, driver, server } = useAppApiClient();

	// Post Queries
	return useQuery<AppPostObject[]>({
		queryKey: ['user/gallery', userId],
		queryFn: async () => {
			const { data } = await client.accounts.statuses(userId, {
				limit: 40,
				userId,
				onlyMedia: true,
				excludeReblogs: true,
				// misskey
				allowPartial: true,
				withFiles: true,
				withRenotes: false,
				withReplies: false,
				// bluesky
				bskyFilter:
					driver === KNOWN_SOFTWARE.BLUESKY ? 'posts_with_media' : undefined,
			});

			return driver === KNOWN_SOFTWARE.BLUESKY
				? PostMiddleware.deserialize<unknown[]>(
						(data as AppBskyFeedGetAuthorFeed.Response).data.feed,
						driver,
						server,
					).filter((o) => !o.meta.isReply)
				: PostMiddleware.deserialize<unknown[]>(data as any[], driver, server);
		},
		enabled: !!client && !!userId,
		initialData: [],
	});
}

export default useProfileGalleryModeInteractor;
