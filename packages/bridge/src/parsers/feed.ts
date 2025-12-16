import { UserParser } from './user.js';
import { AppBskyFeedDefs } from '@atproto/api';
import { KNOWN_SOFTWARE } from '../client/utils/driver.js';
import { FeedObjectType, feedObjectSchema } from '#/types/shared/feed.js';

class Parser {
	static rawToObject(
		input: any,
		driver: KNOWN_SOFTWARE | string,
		server: string,
	): FeedObjectType | null {
		if (driver !== KNOWN_SOFTWARE.BLUESKY) return null;

		const _input = input as AppBskyFeedDefs.GeneratorView;
		const dto: FeedObjectType = {
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
			saved: null,
			pinned: null,
		};

		const { data, error, success } = feedObjectSchema.safeParse(dto);
		if (!success) {
			console.log('[ERROR]: feed dto validation failed', error);
			return null;
		}
		return data as FeedObjectType;
	}

	/**
	 * Deserializes (skips returning the interface step)
	 * raw ap/at proto notification objects
	 * @param input raw ap/at proto notification object
	 * @param driver being used to deserialize this object
	 * @param server
	 */
	static parse<T>(
		input: T | T[],
		driver: string | KNOWN_SOFTWARE,
		server: string,
	): T extends unknown[] ? FeedObjectType[] : FeedObjectType {
		if (Array.isArray(input)) {
			return input
				.map((o) => Parser.rawToObject(o, driver, server))
				.filter((o) => !!o) as unknown as T extends unknown[]
				? FeedObjectType[]
				: never;
		} else {
			return Parser.rawToObject(
				input,
				driver,
				server,
			) as unknown as T extends unknown[] ? never : FeedObjectType;
		}
	}
}

export { Parser as FeedParser };
