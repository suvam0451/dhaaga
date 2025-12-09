import {
	ApiTargetInterface,
	DriverService,
	KNOWN_SOFTWARE,
	PostParser,
	PostTargetInterface,
	ResultPage,
	UserObjectType,
} from '@dhaaga/bridge';
import { queryOptions } from '@tanstack/react-query';

export function postDetailsInterfaceQueryOpts(
	client: ApiTargetInterface,
	driver: KNOWN_SOFTWARE,
	postId: string,
) {
	async function api(): Promise<PostTargetInterface> {
		if (!client) throw new Error('_client not initialized');
		const data = await client.posts.getPost(postId);
		return PostParser.rawToInterface<unknown>(data, driver);
	}

	return queryOptions<PostTargetInterface>({
		queryKey: ['post/view', postId],
		queryFn: api,
		enabled: client && postId !== undefined,
	});
}

export function postHierarchyQueryOpts(
	client: ApiTargetInterface,
	driver: KNOWN_SOFTWARE,
	postId: string,
) {
	async function api() {
		const { data, error } = await client.posts.getPostContext(postId);
		if (error) return null;

		// handled by context solver, instead
		if (DriverService.supportsAtProto(driver)) return data as any;

		return {
			ancestors: PostParser.rawToInterface<unknown[]>(
				(data as any).ancestors,
				driver,
			),
			descendants: PostParser.rawToInterface<unknown[]>(
				(data as any).descendants,
				driver,
			),
		};
	}

	return queryOptions<{
		ancestors: PostTargetInterface[];
		descendants: PostTargetInterface[];
	}>({
		queryKey: ['dhaaga/post/context', postId],
		queryFn: api,
		enabled: !!client && postId !== undefined,
	});
}

export function postLikesQueryOpts(client: ApiTargetInterface, postId: string) {
	async function api(): Promise<ResultPage<UserObjectType[]>> {
		const data = await client.posts.getLikedBy(postId);
		return {
			data: PostParser.parse<unknown[]>(
				data.data,
				client.driver,
				client.server!,
			),
			maxId: data.maxId,
		};
	}

	return queryOptions<ResultPage<UserObjectType[]>>({
		queryKey: ['dhaaga/post/likes', postId],
		queryFn: api,
		enabled: !!client && postId !== undefined,
	});
}
