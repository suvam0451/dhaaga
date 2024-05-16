import db from "../../connections/activity_pub";
import {InstancesRepo} from "./instance.repo";

export type EmojiCreateDTO = {
  name: string;
  url: string;
  category: string;
};

export type EmojiDTO = EmojiCreateDTO & {
  id: number;
  favourited: boolean;
};

export class EmojiRepo {
  static async searchAll(): Promise<unknown> {
    return new Promise((resolve, reject) => {
      return db.getAllSync(`select * from emoji`)
    });
  }

  static async searchByInstance(instanceUrl: string): Promise<EmojiDTO[]> {
    return db.getAllSync<EmojiDTO>(`select * from emoji
						left join instance on instance.id = emoji.instance_id
						WHERE instance.url = ?`, instanceUrl)
  }

  static async search(instanceUrl: string, name: string): Promise<EmojiDTO> {
    const results = db.getAllSync<EmojiDTO>(`select * from emoji
            left join instance on instance.id = emoji.instance_id
            WHERE emoji.name = ? and instance.url = ?`, name, instanceUrl)
    if (results.length > 0) return results[0]
    return null
  }

  static async upsert(instanceUrl: string, emoji: EmojiCreateDTO) {
    const match = await this.search(instanceUrl, emoji.url);
    if (match) {
      db.runSync(`update emoji 
          set name = ?, updated_at = ? 
          where id = ?`, emoji.name, new Date().getTime(), match.id)
    } else {
      const ex = /https:\/\/(.*?)\/.*?/;
      let name = instanceUrl;
      if (ex.test(instanceUrl)) {
        name = instanceUrl.match(ex)[1];
      }
      await InstancesRepo.upsert({url: instanceUrl, name});
      const instance = await InstancesRepo.search(instanceUrl);
      db.runSync(`insert into emoji 
          (name, url, category, instance_id) 
            values (?, ?, ?, ?)`, emoji.name, emoji.url, emoji.category, instance.id)
    }
  }
}
