import {CacheRepo} from "../libs/sqlite/repositories/cache/cache.repo";
import axios from "axios";

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


  private static async getCustomEmojisForInstance(subdomain: string) {
    return await axios.get(
        `${subdomain}/api/emojis`
    );
  }

  /**
   * Update the emoji raw cache everyday
   * @param subdomain
   * @returns
   */
  static async updateEmojiCacheForDomain(subdomain: string) {

    try {
      const emojisUpdatedAt = await CacheRepo.getUpdatedAt(
          `${subdomain}/api/emojis`
      );

      if (emojisUpdatedAt.length > 0) {
        let lastUpdatedAt = new Date(emojisUpdatedAt[0].updated_at);
        lastUpdatedAt.setDate(lastUpdatedAt.getDate() + 1);

        const delta = lastUpdatedAt.getTime() < new Date().getTime();
        if (!delta) {
          console.log(`[INFO]: emoji cache is up to date for ${subdomain}`);
          return;
        }
        const res = await this.getCustomEmojisForInstance(subdomain);
        const payload = JSON.stringify(res.data);
        CacheRepo.set(`${subdomain}/api/emojis`, payload);
        console.log(`[INFO]: emojis updated for ${subdomain}`);
      }
    } catch (e) {
      const res = await this.getCustomEmojisForInstance(subdomain);
      const payload = JSON.stringify(res.data);
      CacheRepo.set(`${subdomain}/api/emojis`, payload);
      console.log(`[INFO]: emojis updated for ${subdomain}`);
    }
  }
}
