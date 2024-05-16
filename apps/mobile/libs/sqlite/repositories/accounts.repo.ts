import db from "../connections/core";
import {CredentialDTO} from "./credentials.repo";

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
    const res = db.getAllSync<AccountDTO>(`select * from accounts
						WHERE domain = ? AND subdomain = ?
						AND username = ?`,
        account.domain, account.subdomain, account.username
    );
    if (res.length > 0) return res[0]
    return null
  }

  static async remove(id: number) {
    db.runSync(`delete from accounts WHERE id = ?`, id)
  }

  /**
   * upsert an account record
   * @param account
   */
  static async add(account: AccountCreateDTO) {
    const conflict = await this.search(account);

    if (conflict) {
      return conflict;
    }

    db.runSync(`insert into accounts
					(domain, subdomain, username, password,
						last_login_at, verified)
						values (?, ?, ?, ?, ?, ?)`,
        account.domain,
        account.subdomain,
        account.username,
        account.password,
        new Date(account.last_login_at).getTime(),
        Number(account.verified || 0),
    );
    return
  }

  static async get(): Promise<AccountDTO[]> {
    return db.getAllSync<AccountDTO>(`select * from accounts`)
  }
}
