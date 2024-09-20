import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { accountMetadata, AccountMetadataSchema } from './account-metadata';
import { accountHashtags, AccountHashtagSchema } from './account-hashtag';
import { accountSettings, AccountSettingSchema } from './account-setting';

export const account = sqliteTable('account', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	identifier: text('identifier').notNull(),
	software: text('software').notNull(),
	server: text('server').notNull(),
	username: text('username').notNull(),
	selected: integer('selected', { mode: 'boolean' }).notNull(),
	createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const account_Relations = relations(account, ({ many }) => ({
	meta: many(accountMetadata),
	tags: many(accountHashtags),
	settings: many(accountSettings),
}));

export const AccountSchema = createSelectSchema(account).extend({
	meta: z.array(AccountMetadataSchema),
	tags: z.array(AccountHashtagSchema),
	settings: z.array(AccountSettingSchema),
});

export type Accounts = z.infer<typeof AccountSchema>;
