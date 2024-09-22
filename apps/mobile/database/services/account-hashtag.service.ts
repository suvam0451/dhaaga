import { getStaticClient, schema } from '../client';
import { eq } from 'drizzle-orm';
import { accountHashtags, AccountHashtags } from '../entities/account-hashtag';

const db = getStaticClient();

class AccountHashtagDbService {
	static async clearForAccount(acctId: number) {
		await db
			.delete(schema.accountHashtags)
			.where(eq(schema.accountHashtags.accountId, acctId));
	}

	static async resetForAccount(acctId: number) {
		await db
			.update(schema.accountHashtags)
			.set({
				active: false,
			})
			.where(eq(accountHashtags.accountId, acctId));
	}

	/**
	 * Update the followed hashtags for an account
	 */
	static async upsertForAccount(acctId: number, items: AccountHashtags[]) {
		const tags = await db.query.accountHashtags.findMany({
			where: eq(schema.accountHashtags.accountId, acctId),
		});

		for await (const tag of items) {
			const match = tags.find((o) => o.tag === tag.tag);
			if (match) {
				await db
					.update(schema.accountHashtags)
					.set({
						active: true,
					})
					.where(eq(schema.accountHashtags.accountId, acctId));
			} else {
				await db.insert(schema.accountHashtags).values({
					isLocal: false,
					accountId: acctId,
					tag: tag.tag,
					active: true,
				});
			}
		}
	}
}

export default AccountHashtagDbService;
