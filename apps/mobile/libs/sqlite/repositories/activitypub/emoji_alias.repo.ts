import db from "../../connections/activity_pub";
import {EmojiRepo} from "./emoji.repo";
import {InstancesRepo} from "./instance.repo";

export type EmojiAliasCreateDTO = {
  alias: string;
};

export type EmojiAliasDTO = EmojiAliasCreateDTO & {
  id: number;
};

export class EmojiAliasRepo {
  static async search(
      instance: string,
      emojiName: string,
      alias: string
  ): Promise<EmojiAliasDTO> {
    return new Promise((resolve, reject) => {
      const results = db.getAllSync<EmojiAliasDTO>(`select * from emoji_alias
            left join emoji on emoji.id = emoji_alias.emoji_id
            left join instance on instance.id = emoji.instance_id
            WHERE emoji.name = ? and instance.url = ?`, emojiName, instance)
      if (results.length > 0) return results[0]
      return null
    });
  }

  static async upsert(
      instanceUrl: string,
      emojiName: string,
      emojiAlias: EmojiAliasCreateDTO
  ) {
    // Ensure instance exists
    let instance = await InstancesRepo.search(instanceUrl);
    if (!instance) {
      await InstancesRepo.upsert({
        url: instanceUrl,
        name: instanceUrl.replace(/^https?:\/\//, ""),
      });
    }
    instance = await InstancesRepo.search(instanceUrl);

    // Ensure emoji exists
    let emoji = await EmojiRepo.search(instanceUrl, emojiName);
    if (!emoji) {
      await EmojiRepo.upsert(instance.url, {
        name: emojiName,
        url: emojiName,
        category: "",
      });
    }
    emoji = await EmojiRepo.search(instanceUrl, emojiName);

    // Upsert emoji alias
    const match = await this.search(instanceUrl, emojiName, emojiAlias.alias);

    if (match) {
      db.runSync(`update emoji_alias 
          set updated_at = ? 
          where id = ?`, new Date().getTime(), match.id)
    } else {
      db.runSync(
          `insert into emoji_alias 
          (emoji_id, alias, updated_at) 
            values (?, ?, ?)`, emoji.id, emojiAlias.alias, new Date().getTime()
      )
    }
  }
}
