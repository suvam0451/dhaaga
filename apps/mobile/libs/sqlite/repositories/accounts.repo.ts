import db from "../connections/core";
import { CredentialDTO } from "./credentials.repo";

export type AccountCreateDTO = {
	domain: string;
	subdomain: string;
	username: string;
	password?: string;
	last_login_at?: Date;
	verified?: boolean;
};

export type AccountDTO = AccountCreateDTO & {
	id: number;
	credentials?: CredentialDTO[];
};

export class AccountsRepo {
	static async search(account: AccountCreateDTO): Promise<AccountDTO | null> {
		return new Promise((resolve, reject) => {
			db.transaction(
				(tx) => {
					tx.executeSql(
						`select * from accounts
						WHERE domain = ? AND subdomain = ?
						AND username = ?`,
						[account.domain, account.subdomain, account.username],
						(_, { rows }) => {
							console.log("sample success", rows);
							if (rows._array.length > 0) {
								resolve(rows._array[0]);
							} else {
								resolve(null);
							}
						}
					);
				},
				() => {
					console.log("error block 1");
					reject("Unknown error occured");
				}
			);
		});
	}

	static async remove(id: number) {
		db.transaction((tx) => {
			tx.executeSql(
				`delete from accounts
			  WHERE id = ?`,
				[id]
			);
		});
	}

	/**
	 * upsert an account record
	 * @param account
	 */
	static async add(account: AccountCreateDTO) {
		const conflict = await this.search(account);
		console.log("conflict is", conflict);
		if (conflict) {
			return conflict;
		}

		return new Promise((resolve, reject) => {
			db.transaction((tx) => {
				tx.executeSql(
					`insert into accounts
					(domain, subdomain, username, password,
						last_login_at, verified)
						values (?, ?, ?, ?, ?, ?)`,
					[
						account.domain,
						account.subdomain,
						account.username,
						account.password,
						new Date(account.last_login_at).getTime(),
						Number(account.verified || 0),
					],
					(_, { rows }) => {
						console.log(rows);
						// console.log("success 2", JSON.stringify(rows))
					},
					(_, error) => {
						reject("Unknown error occured");
						return true;
					}
				);
			});
		});
	}

	static async get(): Promise<AccountDTO[]> {
		return new Promise((resolve, reject) => {
			db.transaction(
				(tx) => {
					tx.executeSql(`select * from accounts`, [], (_, { rows }) => {
						resolve(rows._array);
					});
				},
				() => {
					reject("Unknown error occured");
				},
				() => {
					reject("Unknown error occured");
				}
			);
		});
	}
}
