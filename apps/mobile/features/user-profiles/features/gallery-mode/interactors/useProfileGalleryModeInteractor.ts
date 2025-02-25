import { useAppApiClient } from '../../../../../hooks/utility/global-state-extractors';
import { useQuery } from '@tanstack/react-query';
import { AppBskyFeedGetAuthorFeed } from '@atproto/api';
import { PostParser, DriverService } from '@dhaaga/bridge';
import type { PostObjectType } from '@dhaaga/bridge';

function useProfileGalleryModeInteractor(userId: string) {
	const { client, driver, server } = useAppApiClient();

	// Post Queries
	return useQuery<PostObjectType[]>({
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
				bskyFilter: DriverService.supportsAtProto(driver)
					? 'posts_with_media'
					: undefined,
			});

			return DriverService.supportsAtProto(driver)
				? PostParser.parse<unknown[]>(
						(data as AppBskyFeedGetAuthorFeed.Response).data.feed,
						driver,
						server,
					).filter((o) => !o.meta.isReply)
				: PostParser.parse<unknown[]>(data as any[], driver, server);
		},
		enabled: !!client && !!userId,
		initialData: [],
	});
}

export default useProfileGalleryModeInteractor;
