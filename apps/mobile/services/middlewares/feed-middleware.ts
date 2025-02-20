import { AppFeedObject, appFeedObjectSchema } from '../../types/app-feed.types';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { AppBskyFeedDefs } from '@atproto/api';
import { UserParser } from '@dhaaga/core';

export class FeedMiddleware {
	static rawToObject(
		input: any,
		driver: KNOWN_SOFTWARE | string,
		server: string,
	): AppFeedObject {
		if (driver !== KNOWN_SOFTWARE.BLUESKY) return null;

		const _input = input as AppBskyFeedDefs.GeneratorView;
		const dto: AppFeedObject = {
			uri: _input.uri,
			cid: _input.cid,
			did: _input.did,
			creator: UserParser.parse(_input.creator, driver, server),
			displayName: _input.displayName,
			description: _input.description,
			avatar: _input.avatar,
			likeCount: _input.likeCount,
			labels: _input.labels,
			viewer: {
				like: _input.viewer?.like,
			},
			indexedAt: new Date(_input.indexedAt),
		};

		const { data, error, success } = appFeedObjectSchema.safeParse(dto);
		if (!success) {
			console.log('[ERROR]: feed dto validation failed', error);
			return null;
		}
		return data as AppFeedObject;
	}

	/**
	 * Deserializes (skips returning the interface step)
	 * raw ap/at proto notification objects
	 * @param input raw ap/at proto notification object
	 * @param driver being used to deserialize this object
	 * @param server
	 */
	static deserialize<T>(
		input: T | T[],
		driver: string | KNOWN_SOFTWARE,
		server: string,
	): T extends unknown[] ? AppFeedObject[] : AppFeedObject {
		if (Array.isArray(input)) {
			return input
				.map((o) => FeedMiddleware.rawToObject(o, driver, server))
				.filter((o) => !!o) as unknown as T extends unknown[]
				? AppFeedObject[]
				: never;
		} else {
			return FeedMiddleware.rawToObject(
				input,
				driver,
				server,
			) as unknown as T extends unknown[] ? never : AppFeedObject;
		}
	}
}
