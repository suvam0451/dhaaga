import { CacheRepo } from "../libs/sqlite/repositories/cache/cache.repo";

export type EmojiAdapter = {
	// common
	identifier: string;
	url: string;
	staticUrl: string;
	visibleInPicker: boolean;
	// misskey
	aliases?: string;
	category?: string;
};
export class EmojiService {
	/**
	 * tries to get the emoji from the cache
	 * @param identifier
	 */
	static async get(
		identifier: string,
		domain: string,
		instance: string
	): Promise<EmojiAdapter[]> {
		return new Promise(async (resolve, reject) => {
			try {
				const cacheHit = await CacheRepo.get(`${instance}/api/emojis`);
				if (cacheHit.length > 0) {
					if (domain === "misskey") {
						const parsed = JSON.parse(cacheHit[0].value);
						const dt = parsed.emojis.map((o) => ({
							identifier: o.name,
							staticUrl: o.url,
							url: o.url,
							aliases: o.aliases,
							category: o.category,
							visibleInPicker: false,
						}));
						resolve(dt);
					}
				}
			} catch (e) {
				console.log("cache miss", e);
				reject(e);
			}
		});
	}
}
