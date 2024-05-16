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
      const results = db.getAllSync<InstanceDTO>(`select * from instance
            WHERE url = ?`, url)
      if (results.length > 0) return results[0]
      return null
    });
  }

  static async upsert(instance: InstanceCreateDTO) {
    const match = await this.search(instance.url);

    if (match) {
      db.runSync(`update instance set name = ? where id = ?`, instance.name,
          match.id,)
    } else {
      db.runSync(`insert into instance
          (name, url) 
            values (?, ?)`, instance.name, instance.url)
    }
  }
}
