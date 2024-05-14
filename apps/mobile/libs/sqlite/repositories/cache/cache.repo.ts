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
    return db.getAllSync<CacheDTO>(`select * from cache where key= ?`, key)
  }

  static async set(key: string, value: string) {
    db.runSync(`insert into cache (key, value, updated_at) values (?, ?, datetime('now'))
            on conflict(key) do update set value = excluded.value, updated_at = excluded.updated_at
            `, key, value)
  }

  static async getUpdatedAt(key: string): Promise<any[]> {
    return db.getAllSync<any>(`select updated_at from cache where key = ?`)
  }
}
