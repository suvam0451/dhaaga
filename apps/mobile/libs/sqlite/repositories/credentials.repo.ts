import db from "../_core";
import { AccountCreateDTO, AccountDTO } from "./accounts.repo";

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
	static async add(account: AccountCreateDTO | AccountDTO, credential) {
    db.transaction((tx) => {
      tx.executeSql(
        `insert into credentials 
        (account_id, credential_type, credential_value, updated_at) 
          values (?, ?, ?, ?)`,
        [
          1,
          credential.credential_type,
          credential.credential_value,
          new Date().getTime(),
        ]
      );
    });
  }
}
