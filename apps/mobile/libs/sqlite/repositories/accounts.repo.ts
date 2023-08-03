import db from "../_core";

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
	credentials?: [];
};

export class AccountsRepo {
	/**
	 * upsert an account record
	 * @param account
	 */
	static async add(account: AccountCreateDTO) {
		db.transaction((tx) => {
			tx.executeSql(
				`select * from accounts
        WHERE domain = ? AND subdomain = ?
        AND username = ?`,
				[account.domain, account.subdomain, account.username],
				(_, { rows }) => console.log("success 1", JSON.stringify(rows))
			);
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
				]
			);
			tx.executeSql(
				`select * from accounts
        WHERE domain = ? AND subdomain = ?
        AND username = ?`,
				[account.domain, account.subdomain, account.username],
				(_, { rows }) => console.log("success 2", JSON.stringify(rows))
			);
		});
	}
}
