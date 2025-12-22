import { useQuery } from '@tanstack/react-query';
import {
	postGetLikedByQueryOpts,
	postGetSharedByQueryOpts,
} from '@dhaaga/react';
import { useAppApiClient } from '#/states/global/hooks';

export function useApiGetPostSharedBy(postId: string, maxId?: string) {
	const { client } = useAppApiClient();
	return useQuery(postGetSharedByQueryOpts(client, postId, maxId));
}

export function useApiGetPostLikedBy(postId: string, maxId?: string) {
	const { client } = useAppApiClient();
	return useQuery(postGetLikedByQueryOpts(client, postId, maxId));
}

export function useApiGetPostReplies(postId: string, maxId?: string) {
	const { client } = useAppApiClient();
}

export function useApiGetPostQuotes(postId: string, maxId?: string) {}
