import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { account } from './account';

export const accountHashtags = sqliteTable('account_hashtag', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	active: integer('active', { mode: 'boolean' }).notNull(),
	tag: text('tag').notNull(),
	following: integer('following', { mode: 'boolean' }).$defaultFn(() => true),
	isLocal: integer('is_local', { mode: 'boolean' }).notNull(),
	// FKs
	accountId: integer('account_id')
		.notNull()
		.references(() => account.id),
});

export const accountHashtag_Relations = relations(
	accountHashtags,
	({ one }) => ({
		account: one(account, {
			fields: [accountHashtags.accountId],
			references: [account.id],
		}),
	}),
);

export const AccountHashtagSchema = createSelectSchema(accountHashtags);
export type AccountHashtags = z.infer<typeof AccountHashtagSchema>;
