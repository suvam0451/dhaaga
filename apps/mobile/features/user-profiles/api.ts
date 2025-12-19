import {
	unifiedPostFeedQueryOptions,
	userGalleryQueryOpts,
} from '@dhaaga/react';
import { TimelineFetchMode } from '@dhaaga/core';
import { useQuery } from '@tanstack/react-query';
import { useAppApiClient } from '#/states/global/hooks';

function useApiGetOriginalPostsFromAuthor(userId: string, maxId: string) {
	const { client, driver, server } = useAppApiClient();

	return useQuery(
		unifiedPostFeedQueryOptions(client, driver, server, userId, {
			type: TimelineFetchMode.USER,
			maxId,
			limit: 10,
			query: {
				id: userId,
				label: 'N/A',
			},
			opts: {
				bskyFilter: 'posts_no_replies',
			},
		}),
	);
}

function useApiGetRepliesFromAuthor(userId: string, maxId: string) {
	const { client, driver, server } = useAppApiClient();

	return useQuery(
		unifiedPostFeedQueryOptions(client, driver, server, userId, {
			type: TimelineFetchMode.USER,
			maxId,
			query: {
				id: userId,
				label: 'N/A',
			},
			opts: { bskyFilter: 'posts_with_replies' },
		}),
	);
}

function useApiGetPostsWithMediaFromAuthor(userId: string, maxId: string) {
	const { client } = useAppApiClient();
	return useQuery(userGalleryQueryOpts(client, userId, maxId));
}

export {
	useApiGetOriginalPostsFromAuthor,
	useApiGetRepliesFromAuthor,
	useApiGetPostsWithMediaFromAuthor,
};
