import { z } from 'zod';
import { ResultPage } from '../types/api-response.js';

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

/**
 * Extracts pagination keys and object array.
 *
 * Works for various forms of input
 */
class Util {
	static getPage<T>(
		input: any,
		transformer: (input: any[]) => T[] = (input: any[]) => input,
	): ResultPage<T[]> {
		/**
		 * Handle non-array-based results
		 */
		let result = null;

		/**
		 * Generic post-list
		 */
		result = genericPostListSchema.safeParse(input);
		if (result.success) {
			return {
				data: transformer(input),
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
				data: transformer(result.data.data.data),
				minId: result.data.data.minId,
				maxId: result.data.data.maxId,
			};
		}

		result = atProtoPostSearchResultResponseSchema.safeParse(input);
		if (result.success) {
			return {
				data: transformer(result.data.posts),
				minId: null,
				maxId: result.data.cursor || null,
			};
		}

		result = atProtoUserFollowsResponseSchema.safeParse(input);
		if (result.success) {
			return {
				data: transformer(result.data.data.follows),
				minId: null,
				maxId: result.data.data.cursor || null,
			};
		}

		result = atProtoUserFollowersResponseSchema.safeParse(input);
		if (result.success) {
			return {
				data: transformer(result.data.data.followers),
				minId: null,
				maxId: result.data.data.cursor || null,
			};
		}

		result = misskeyApiUserFollowsResponseSchema.safeParse(input);
		if (result.success) {
			return {
				data: transformer(result.data.data.map((o) => o.followee)),
				maxId: result.data.data[result.data.data.length - 1].id,
				minId: null,
			};
		}

		result = misskeyApiUserFollowersResponseSchema.safeParse(input);
		if (result.success) {
			return {
				data: transformer(result.data.data.map((o) => o.follower)),
				maxId: result.data.data[result.data.data.length - 1].id,
				minId: null,
			};
		}

		throw new Error('failed to extract pagination keys');
	}
}

export { Util as KeyExtractorUtil };
