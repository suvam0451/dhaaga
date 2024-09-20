import { Accounts } from '../entities/account';
import { getStaticClient, schema } from '../client';
import { and, eq } from 'drizzle-orm';

const db = getStaticClient();
const { account: Account } = schema;
const { accountMetadata: AccountMeta } = schema;

class AccountMetaService {
	static async findMeta(acct: Accounts, key: string) {
		const res = await db
			.select()
			.from(AccountMeta)
			.leftJoin(Account, eq(AccountMeta.accountId, Account.id))
			.where(
				and(
					eq(AccountMeta.accountId, acct.id as unknown as number),
					eq(AccountMeta.key, key),
				),
			);
		return res.length > 0 ? res[0] : null;
	}

	static async upsertMeta(acct: Accounts, key: string, value: string) {
		const res = await db
			.select()
			.from(AccountMeta)
			.leftJoin(Account, eq(AccountMeta.accountId, Account.id))
			.where(
				and(
					eq(Account.id, acct.id as unknown as number),
					eq(AccountMeta.key, key),
				),
			);
		if (res.length === 0) {
			await db.insert(AccountMeta).values({
				accountId: acct.id as unknown as number,
				key,
				value,
			});
		}
	}
}

export default AccountMetaService;
