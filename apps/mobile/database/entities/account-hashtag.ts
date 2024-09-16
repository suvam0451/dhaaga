import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { account } from './account';

export const accountHashtags = sqliteTable('account_hashtag', {
	id: text('id')
		.$defaultFn(() => createId())
		.notNull(),
	active: integer('active', { mode: 'boolean' }).$defaultFn(() => true),
	tag: text('tag').notNull(),
	accountId: integer('account_id').notNull(),
	following: integer('following', { mode: 'boolean' }).$defaultFn(() => true),
	isLocal: integer('is_local').notNull(),
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
