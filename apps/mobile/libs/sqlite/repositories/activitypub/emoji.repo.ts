import db from "../../connections/activity_pub";
import { InstancesRepo } from "./instance.repo";

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
	static async search(instanceUrl: string, name: string): Promise<EmojiDTO> {
		return new Promise((resolve, reject) => {
			db.transaction((tx) => {
				tx.executeSql(
					`select * from emoji
            left join instance on instance.id = emoji.instance_id
            WHERE name = ? and instance.url = ?`,
					[name, instanceUrl],
					(_, { rows }) => {
						if (rows._array.length > 0) {
							resolve(rows._array[0]);
						} else {
							resolve(null);
						}
					}
				);
			});
		});
	}

	static async upsert(instanceUrl: string, emoji: EmojiCreateDTO) {
		const match = await this.search(instanceUrl, emoji.url);
		if (match) {
			db.transaction((tx) => {
				tx.executeSql(
					`update emoji 
          set name = ?, updated_at = ? 
          where id = ?`,
					[emoji.name, new Date().getTime(), match.id]
				);
			});
		} else {
			await InstancesRepo.upsert({ url: instanceUrl, name: instanceUrl });
			const instance = await InstancesRepo.search(instanceUrl);
			db.transaction((tx) => {
				tx.executeSql(
					`insert into emoji 
          (name, url, category, instance_id) 
            values (?, ?, ?, ?)`,
					[emoji.name, emoji.url, emoji.category, instance.id]
				);
			});
		}
	}
}
