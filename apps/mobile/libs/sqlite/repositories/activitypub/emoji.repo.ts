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
	static async searchAll(): Promise<EmojiDTO[]> {
		return new Promise((resolve, reject) => {
			db.transaction(
				(tx) => {
					tx.executeSql(`select * from emoji`, [], (_, { rows }) => {
						// console.log(rows);
						resolve(rows._array);
					});
				},
				(e) => {
					console.log("[EmojiRepo] searchAll error", e);
				},
				() => {
					// console.log("[EmojiRepo] searchAll success");
				}
			);
		});
	}
	static async searchByInstance(instanceUrl: string): Promise<EmojiDTO[]> {
		return new Promise((resolve, reject) => {
			db.transaction(
				(tx) => {
					tx.executeSql(
						`select * from emoji
						left join instance on instance.id = emoji.instance_id
						WHERE instance.url = ?`,
						[instanceUrl],
						(_, { rows }) => {
							resolve(rows._array);
						}
					);
				},
				(e) => {
					console.log("[EmojiRepo] searchByInstance error", e);
				}
			);
		});
	}
	static async search(instanceUrl: string, name: string): Promise<EmojiDTO> {
		return new Promise((resolve, reject) => {
			db.transaction(
				(tx) => {
					tx.executeSql(
						`select * from emoji
            left join instance on instance.id = emoji.instance_id
            WHERE emoji.name = ? and instance.url = ?`,
						[name, instanceUrl],
						(_, { rows }) => {
							if (rows._array.length > 0) {
								resolve(rows._array[0]);
							} else {
								resolve(null);
							}
						}
					);
				},
				(e) => {
					console.log("[EmojiRepo] search error", e);
				}
			);
		});
	}

	static async upsert(instanceUrl: string, emoji: EmojiCreateDTO) {
		const match = await this.search(instanceUrl, emoji.url);
		if (match) {
			db.transaction(
				(tx) => {
					tx.executeSql(
						`update emoji 
          set name = ?, updated_at = ? 
          where id = ?`,
						[emoji.name, new Date().getTime(), match.id]
					);
				},
				() => {
					console.log("[EmojiRepo] upsert error");
				},
				() => {
					// console.log("[EmojiRepo] upsert success");
				}
			);
		} else {
			const ex = /https:\/\/(.*?)\/.*?/;
			let name = instanceUrl;
			if (ex.test(instanceUrl)) {
				name = instanceUrl.match(ex)[1];
			}
			await InstancesRepo.upsert({ url: instanceUrl, name });
			const instance = await InstancesRepo.search(instanceUrl);
			db.transaction(
				(tx) => {
					tx.executeSql(
						`insert into emoji 
          (name, url, category, instance_id) 
            values (?, ?, ?, ?)`,
						[emoji.name, emoji.url, emoji.category, instance.id]
					);
				},
				() => {
					console.log("[EmojiRepo] create error");
				},
				() => {
					// console.log("[EmojiRepo] create success");
				}
			);
		}
	}
}
