import db from "../../connections/cache";

export type CacheCreateDTO = {
	key: string;
	value: string;
};

export type CacheDTO = CacheCreateDTO & {
	id: number;
};

export class CacheRepo {
	static async get(key: string): Promise<CacheDTO[]> {
		return new Promise((resolve, reject) => {
			db.transaction(
				(tx) => {
					tx.executeSql(
						`select * from cache where key= ?`,
						[key],
						(_, { rows }) => {
							resolve(rows._array);
						}
					);
				},
				(e) => {
					console.log("cache get error", e);
					reject(e);
				}
			);
		});
	}

	static async set(key: string, value: string) {
		return new Promise((resolve, reject) => {
			db.transaction(
				(tx) => {
					tx.executeSql(
						`insert into cache (key, value, updated_at) values (?, ?, datetime('now'))
            on conflict(key) do update set value = excluded.value, updated_at = excluded.updated_at
            `,
						[key, value],
						(_, { rows }) => {
							resolve(rows._array);
						}
					);
				},
				(e) => {
					console.log("cache set error", e);
					reject(e);
				}
			);
		});
	}

	static async getUpdatedAt(key: string): Promise<any[]> {
		return new Promise((resolve, reject) => {
			db.transaction(
				(tx) => {
					tx.executeSql(
						`select updated_at from cache where key = ?`,
						[key],
						(_, { rows }) => {
							resolve(rows._array);
						}
					);
				},
				(e) => {
					console.log("cache getUpdatedAt error", e);
					reject(e);
				}
			);
		});
	}
}
