import {
	ApiTargetInterface,
	type DhaagaPostThreadInterfaceType,
	DriverService,
	PostObjectType,
	PostParser,
	ResultPage,
	UserObjectType,
} from '@dhaaga/bridge';
import { queryOptions } from '@tanstack/react-query';

export function postGetQueryOpts(client: ApiTargetInterface, postId: string) {
	async function api(): Promise<PostObjectType> {
		const data = await client.posts.getPost(postId);
		return PostParser.parse<unknown>(data, client.driver, client.server!);
	}

	return queryOptions<PostObjectType>({
		queryKey: ['dhaaga/post/view', postId],
		queryFn: api,
		enabled: client && postId !== undefined,
	});
}

export function postHierarchyQueryOpts(
	client: ApiTargetInterface,
	postId: string,
) {
	async function api() {
		const data = await client.posts.getPostContext(postId);

		// handled by context solver, instead
		if (DriverService.supportsAtProto(client.driver)) {
			return {
				ancestors: data.thread
					.filter((o: any) => o.depth < 0)
					.map((o: any) => ({
						depth: o.depth,
						post: PostParser.rawToInterface<unknown>(
							o.value.post,
							client.driver,
						),
					})),
				descendants: data.thread
					.filter((o: any) => o.depth > 0)
					.map((o: any) => ({
						depth: o.depth,
						post: PostParser.rawToInterface<unknown>(
							o.value.post,
							client.driver,
						),
					})),
			};
		} else {
			return {
				ancestors: (data as any).ancestors.map((o: any) => ({
					depth: -1,
					post: PostParser.rawToInterface<unknown[]>(
						(data as any).ancestors,
						client.driver,
					),
				})),
				descendants: (data as any).ancestors.map((o: any) => ({
					depth: 1,
					post: PostParser.rawToInterface<unknown[]>(
						(data as any).descendants,
						client.driver,
					),
				})),
			};
		}
	}

	return queryOptions<DhaagaPostThreadInterfaceType>({
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
