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
			db.transaction((tx) => {
				tx.executeSql(
					`select * from instances
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
			});
		});
	}

	static async upsert(instance: InstanceCreateDTO) {
		const match = await this.search(instance.url);
		if (match) {
			db.transaction((tx) => {
				tx.executeSql(
					`update instances 
          set name = ?, updated_at = ? 
          where id = ?`,
					[instance.name, new Date().getTime(), match.id]
				);
			});
		} else {
			db.transaction((tx) => {
				tx.executeSql(
					`insert into instances 
          (name, url, updated_at) 
            values (?, ?, ?)`,
					[instance.name, instance.url, new Date().getTime()]
				);
			});
		}
	}
}
