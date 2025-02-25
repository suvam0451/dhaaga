import { z } from 'zod';
import { defaultResultPage, ResultPage } from './pagination.js';

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
		cursor: z.ostring(),
		follows: z.array(z.any()),
	}),
});

const atProtoUserFollowersResponseSchema = z.object({
	success: z.boolean(),
	data: z.object({
		cursor: z.ostring(),
		followers: z.array(z.any()),
	}),
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

export function extractKeys<T>(
	input: any,
	transformer: (input: any[]) => T[] = (input: any[]) => input,
	seed?: { minId: string | null; maxId: string | null },
): ResultPage<T> {
	/**
	 * Handle array based results
	 */
	if (Array.isArray(input)) {
		return {
			items: transformer(input),
			minId: null,
			maxId: null,
		};
	}

	/**
	 * Handle non-array based results
	 */
	let result = null;

	result = driverLinkHeaderPaginationBlock.safeParse(input);
	if (result.success) {
		return {
			items: transformer(result.data.data.data),
			minId: result.data.data.minId,
			maxId: result.data.data.maxId,
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
