import db from "../../connections/activity_pub";

export type InstanceCreateDTO = {
	name: string;
	url: string;
};

export type InstanceDTO = InstanceCreateDTO & {
	id: number;
	favourited: boolean;
	blocked: boolean;
};

export class InstancesRepo {
	static async search(url: string): Promise<InstanceDTO> {
		return new Promise((resolve, reject) => {
			db.transaction(
				(tx) => {
					tx.executeSql(
						`select * from instance
            WHERE url = ?`,
						[url],
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
					console.log("[InstanceRepo] search error", e);
				},
				() => {
					// console.log("[InstanceRepo] search success");
				}
			);
		});
	}

	static async upsert(instance: InstanceCreateDTO) {
		const match = await this.search(instance.url);
		// console.log("instance match is", match);
		if (match) {
			db.transaction(
				(tx) => {
					tx.executeSql(`update instance set name = ? where id = ?`, [
						instance.name,
						match.id,
					]);
				},
				(e) => {
					console.log("[InstanceRepo] update error", e);
				}
			);
		} else {
			db.transaction(
				(tx) => {
					tx.executeSql(
						`insert into instance
          (name, url) 
            values (?, ?)`,
						[instance.name, instance.url]
					);
				},
				(e) => {
					console.log("[InstanceRepo] create error", e);
				}
			);
		}
	}
}
