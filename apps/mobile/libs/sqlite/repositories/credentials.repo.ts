import db from "../connections/core";
import {AccountDTO} from "./accounts.repo";

export type CredentialCreateDTO = {
  credential_type: string;
  credential_value: string;
};

export type CredentialDTO = CredentialCreateDTO & {
  id: number;
  account_id: number;
  credential_type: string;
  credential_value: string;
  updated_at: Date;
};

export class CredentialsRepo {
  static async search(
      account: AccountDTO,
      credential_type: string
  ): Promise<CredentialDTO> {
    if (!account) return null
    const results = db.getAllSync<CredentialDTO>(`select * from credentials
            WHERE account_id = ? AND credential_type = ?`, account.id, credential_type)
    if (results.length > 0) return results[0]
    return null
  }

  static async upsert(account: AccountDTO, credential: CredentialCreateDTO) {
    const match = await this.search(account, credential.credential_type);
    if (match) {
      console.log("[DB] : credential match found. updating")
      db.runSync(`update credentials 
          set credential_value = ?, updated_at = ? 
          where id = ?`, credential.credential_value, new Date().getTime(), match.id)
    } else {
      console.log("[DB] : credential match not found. inserting")
      db.runSync(`insert into credentials 
          (account_id, credential_type, credential_value, updated_at) 
            values (?, ?, ?, ?)`, account.id,
          credential.credential_type,
          credential.credential_value,
          new Date().getTime(),)
    }
  }

  static async getByAccountId(accountId: number): Promise<CredentialDTO[]> {
    return db.getAllSync<CredentialDTO>(`select * from credentials
          WHERE account_id = ?`, accountId)
  }
}
