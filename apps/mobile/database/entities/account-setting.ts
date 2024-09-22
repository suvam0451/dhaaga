import { text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { account } from './account';
import { integer } from 'drizzle-orm/sqlite-core';

export const accountSettings = sqliteTable('account_setting', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	key: text('key').notNull(),
	value: text('value').notNull(),
	// FKs
	accountId: integer('account_id')
		.notNull()
		.references(() => account.id),
	// Meta
	updatedAt: text('updated_at')
		.notNull()
		.default(sql`(CURRENT_TIMESTAMP)`)
		.$onUpdate(() => sql`(CURRENT_TIMESTAMP)`),
});

export const accountSettings_Relations = relations(
	accountSettings,
	({ one }) => ({
		account: one(account, {
			fields: [accountSettings.accountId],
			references: [account.id],
		}),
	}),
);

export const AccountSettingSchema = createInsertSchema(accountSettings);
export type AccountSettings = z.infer<typeof AccountSettingSchema>;
