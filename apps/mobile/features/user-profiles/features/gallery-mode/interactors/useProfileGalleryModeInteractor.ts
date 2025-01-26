import { useAppApiClient } from '../../../../../hooks/utility/global-state-extractors';
import { KNOWN_SOFTWARE, StatusInterface } from '@dhaaga/bridge';
import { useQuery } from '@tanstack/react-query';
import { AppBskyFeedGetAuthorFeed } from '@atproto/api';
import { PostMiddleware } from '../../../../../services/middlewares/post.middleware';

function useProfileGalleryModeInteractor(userId: string) {
	const { client, driver } = useAppApiClient();

	// Post Queries
	return useQuery<StatusInterface[]>({
		queryKey: [client, userId],
		queryFn: async () => {
			{
				const { data } = await client.accounts.statuses(userId, {
					limit: 40,
					userId,
					onlyMedia: true,
					excludeReblogs: true,
					bskyFilter:
						driver === KNOWN_SOFTWARE.BLUESKY ? 'posts_with_media' : undefined,
				});

				if (driver === KNOWN_SOFTWARE.BLUESKY) return [];
				return driver === KNOWN_SOFTWARE.BLUESKY
					? PostMiddleware.rawToInterface<unknown[]>(
							(data as AppBskyFeedGetAuthorFeed.Response).data.feed,
							driver,
						)
					: PostMiddleware.rawToInterface<unknown[]>(data as any[], driver);
			}
		},
		enabled: !!client && !!userId,
		initialData: [],
	});
}

export default useProfileGalleryModeInteractor;
