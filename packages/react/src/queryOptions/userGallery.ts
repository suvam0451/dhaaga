import { queryOptions } from '@tanstack/react-query';
import { AppBskyFeedGetAuthorFeed } from '@atproto/api';
import { PostParser, DriverService, ApiTargetInterface } from '@dhaaga/bridge';
import type { PostObjectType } from '@dhaaga/bridge';

async function api(client: ApiTargetInterface, userId: string) {
	const result = await client.accounts.statuses(userId, {
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
		bskyFilter: DriverService.supportsAtProto(client.driver)
			? 'posts_with_media'
			: undefined,
	});

	if (!result.isOk()) return [];
	const data = result.unwrap();

	return DriverService.supportsAtProto(client.driver)
		? PostParser.parse<unknown[]>(
				(data as AppBskyFeedGetAuthorFeed.Response).data.feed,
				client.driver,
				client.server!,
			).filter((o) => !o.meta.isReply)
		: PostParser.parse<unknown[]>(data as any[], client.driver, client.server!);
}

export function userGallery(client: ApiTargetInterface, userId: string) {
	return queryOptions<PostObjectType[]>({
		queryKey: [`dhaaga/profile/gallery`, userId],
		queryFn: () => api(client, userId),
		enabled: !!client && !!userId,
		initialData: [],
	});
}

// export default useProfileGalleryModeInteractor;
