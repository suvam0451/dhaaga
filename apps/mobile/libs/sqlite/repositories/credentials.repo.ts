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
	static async search(
		account: AccountDTO,
		credential_type: string
	): Promise<CredentialDTO> {
		return new Promise((resolve, reject) => {
			db.transaction((tx) => {
				tx.executeSql(
					`select * from credentials
            WHERE account_id = ? AND credential_type = ?`,
					[account.id, credential_type],
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
	static async upsert(account: AccountDTO, credential: CredentialCreateDTO) {
		const match = await this.search(account, credential.credential_type);
		if (match) {
			db.transaction((tx) => {
				tx.executeSql(
					`update credentials 
          set credential_value = ?, updated_at = ? 
          where id = ?`,
					[credential.credential_value, new Date().getTime(), match.id]
				);
			});
		} else {
			db.transaction((tx) => {
				tx.executeSql(
					`insert into credentials 
          (account_id, credential_type, credential_value, updated_at) 
            values (?, ?, ?, ?)`,
					[
						account.id,
						credential.credential_type,
						credential.credential_value,
						new Date().getTime(),
					]
				);
			});
		}
	}

	static getByAccountId(accountId: number): Promise<CredentialDTO[]> {
		return new Promise((resolve, reject) => {
			db.transaction((tx) => {
				tx.executeSql(
					`select * from credentials
          WHERE account_id = ?`,
					[accountId],
					(_, { rows }) => {
						resolve(rows._array);
					}
				);
			});
		});
	}
}
