import { useAppApiClient } from '#/states/global/hooks';
import type {
	UserObjectType,
	PostObjectType,
	ResultPage,
} from '@dhaaga/bridge';
import { useQuery } from '@tanstack/react-query';

const LIMIT = 10;

export function useApiGetPostLikes(id: string, maxId: string) {
	const { client } = useAppApiClient();

	function api() {
		return client.posts.getLikedBy(id, LIMIT, maxId);
	}

	return useQuery<ResultPage<UserObjectType[]>>({
		queryKey: ['dhaaga/post/likes', id],
		queryFn: api,
	});
}

export function useApiGetPostComments(id: string, maxId: string) {
	const { client } = useAppApiClient();

	function api() {
		return client.posts.getLikedBy(id, LIMIT, maxId);
	}

	return useQuery<ResultPage<UserObjectType[]>>({
		queryKey: ['dhaaga/post/comments', id],
		queryFn: api,
	});
}

export function useApiGetPostShares(id: string, maxId: string) {
	const { client } = useAppApiClient();

	function api() {
		return client.posts.getSharedBy(id, LIMIT, maxId);
	}

	return useQuery<ResultPage<PostObjectType[]>>({
		queryKey: ['dhaaga/post/shares', id],
		queryFn: api,
	});
}

export function useApiGetPostQuotes(id: string, maxId: string) {
	const { client } = useAppApiClient();

	function api() {
		return client.posts.getQuotedBy(id, LIMIT, maxId);
	}

	return useQuery<ResultPage<PostObjectType[]>>({
		queryKey: ['dhaaga/post/quotes', id],
		queryFn: api,
	});
}
