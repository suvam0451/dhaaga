import { getStaticClient, schema } from '../client';
import { and, eq, ne } from 'drizzle-orm';
import AccountMetaService from './account-secret.service';
import { Accounts } from '../entities/account';

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
	static async remove(id: number) {
		await db.delete(Account).where(eq(Account.id, id));
	}

	static async select(id: number) {
		await db.update(Account).set({ selected: true }).where(eq(Account.id, id));
		await db.update(Account).set({ selected: false }).where(ne(Account.id, id));
	}

	static async deselect(id: number) {
		await db.update(Account).set({ selected: false }).where(eq(Account.id, id));
	}

	// subdomain: dto.subdomain,
	static async find(dto: AccountCreateDTO) {
		return db.query.account.findFirst({
			where: (o, { eq }) =>
				and(eq(o.username, dto.username), eq(o.server, dto.subdomain)),
		});
	}

	static async upsert(
		acct: AccountCreateDTO,
		credentials: {
			key: string;
			value?: string;
		}[],
	) {
		const removeHttps = acct.subdomain?.replace(/^https?:\/\//, '');
		let match = await this.find(acct);
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
					selected: false,
				});
				console.log(uploaded);
			} catch (e) {
				console.log(e);
			}
		}
		match = await this.find(acct);
		if (!match) return null;
		for await (const credential of credentials) {
			await AccountMetaService.upsertMeta(
				match,
				credential.key,
				credential.value,
			);
		}
	}

	static async setSoftware(acct: Accounts, software: string) {
		await db
			.update(Account)
			.set({
				software,
			})
			.where(eq(Account.id, acct.id as unknown as number));
	}

	static async delete(acct: Accounts) {
		await db
			.delete(Account)
			.where(eq(Account.id, acct.id as unknown as number));
	}
}

export default AccountDbService;
