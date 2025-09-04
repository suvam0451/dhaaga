import { z } from 'zod';
import { defaultResultPage, ResultPage } from './pagination.js';
import { ApiResult } from './api-result.js';

const driverLinkHeaderPaginationBlock = z.object({
	data: z.object({
		data: z.array(z.any()),
		maxId: z.string().nullable(),
		minId: z.string().nullable(),
	}),
});

const atProtoUserFollowsResponseSchema = z.object({
	success: z.boolean(),
	data: z.object({
		cursor: z.string().optional(),
		follows: z.array(z.any()),
	}),
});

const atProtoUserFollowersResponseSchema = z.object({
	success: z.boolean(),
	data: z.object({
		cursor: z.string().optional(),
		followers: z.array(z.any()),
	}),
});

const atProtoPostSearchResultResponseSchema = z.object({
	cursor: z.string().optional(),
	posts: z.array(z.any()),
});

const misskeyApiUserFollowsResponseSchema = z.object({
	data: z.array(
		z.object({
			id: z.string(),
			followee: z.any(),
		}),
	),
});

const misskeyApiUserFollowersResponseSchema = z.object({
	data: z.array(
		z.object({
			id: z.string(),
			follower: z.any(),
		}),
	),
});

const genericPostListSchema = z.array(
	z.object({
		id: z.string(),
	}),
);

class Util {
	static getPageFromResult<T>(
		input: ApiResult<any>,
		transformer: (input: any[]) => T[] = (input: any[]) => input,
		seed?: { minId: string | null; maxId: string | null },
	) {}

	static getPage<T>(
		input: any,
		transformer: (input: any[]) => T[] = (input: any[]) => input,
		seed?: { minId: string | null; maxId: string | null },
	): ResultPage<T> {
		/**
		 * Handle non-array based results
		 */
		let result = null;

		/**
		 * Generic post list
		 */
		result = genericPostListSchema.safeParse(input);
		if (result.success) {
			return {
				items: transformer(input),
				minId: result.data.length > 0 ? result.data[0].id : null,
				maxId:
					result.data.length > 0
						? result.data[result.data.length - 1].id
						: null,
			};
		}

		result = driverLinkHeaderPaginationBlock.safeParse(input);
		if (result.success) {
			return {
				items: transformer(result.data.data.data),
				minId: result.data.data.minId,
				maxId: result.data.data.maxId,
			};
		}

		result = atProtoPostSearchResultResponseSchema.safeParse(input);
		if (result.success) {
			return {
				items: transformer(result.data.posts),
				minId: null,
				maxId: result.data.cursor || null,
			};
		}

		result = atProtoUserFollowsResponseSchema.safeParse(input);
		if (result.success) {
			return {
				items: transformer(result.data.data.follows),
				minId: null,
				maxId: result.data.data.cursor || null,
			};
		}

		result = atProtoUserFollowersResponseSchema.safeParse(input);
		if (result.success) {
			return {
				items: transformer(result.data.data.followers),
				minId: null,
				maxId: result.data.data.cursor || null,
			};
		}

		result = misskeyApiUserFollowsResponseSchema.safeParse(input);
		if (result.success) {
			return {
				items: transformer(result.data.data.map((o) => o.followee)),
				maxId: result.data.data[result.data.data.length - 1].id,
				minId: null,
			};
		}

		result = misskeyApiUserFollowersResponseSchema.safeParse(input);
		if (result.success) {
			return {
				items: transformer(result.data.data.map((o) => o.follower)),
				maxId: result.data.data[result.data.data.length - 1].id,
				minId: null,
			};
		}

		return defaultResultPage;
	}
}

export { Util as KeyExtractorUtil };
