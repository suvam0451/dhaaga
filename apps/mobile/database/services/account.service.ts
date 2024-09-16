import { getStaticClient, schema } from '../client';
import { and, eq, ne } from 'drizzle-orm';

const db = getStaticClient();
const { account: Account } = schema;

export type AccountCreateDTO = {
	domain: string;
	subdomain: string;
	username: string;
	avatarUrl: string;
	displayName?: string;
	password?: string;
	last_login_at?: Date;
	verified?: boolean;
};

class AccountDbService {
	static remove(id: string) {
		db.delete(Account).where(eq(Account.identifier, id));
	}

	static async select(id: string) {
		const match = db.select().from(Account).where(eq(Account.identifier, id));
		if (match) {
			await db
				.update(Account)
				.set({ selected: true } as any)
				.where(eq(Account.identifier, id));
			await db
				.update(Account)
				.set({ selected: true } as any)
				.where(ne(Account.identifier, id));
		}
	}

	// subdomain: dto.subdomain,
	static async find(dto: AccountCreateDTO) {
		return db.query.account.findFirst({
			where: (o, { eq }) =>
				and(eq(o.username, dto.username), eq(o.server, dto.subdomain)),
		});
	}

	static async upsert(acct: AccountCreateDTO) {
		const removeHttps = acct.subdomain?.replace(/^https?:\/\//, '');
		const match = await this.find(acct);
		console.log(acct, match);
		if (match) {
			db.update(Account)
				.set({
					software: acct.domain,
					server: removeHttps,
					username: acct.username,
				})
				.where(eq(Account.id, match.id));
		} else {
			try {
				const uploaded = await db.insert(Account).values({
					software: acct.domain,
					server: removeHttps,
					username: acct.username,
					identifier: 'N/A',
				});
				console.log(uploaded);
			} catch (e) {
				console.log(e);
			}
		}
	}
}

export default AccountDbService;
