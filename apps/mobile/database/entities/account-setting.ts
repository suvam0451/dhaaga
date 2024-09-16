import { text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { relations, sql } from 'drizzle-orm';
import { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { account } from './account';
import { integer } from 'drizzle-orm/sqlite-core';

export const accountSettings = sqliteTable('account_setting', {
	id: text('id')
		.$defaultFn(() => createId())
		.notNull(),
	key: text('key').notNull(),
	value: text('value').notNull(),
	accountId: integer('account_id').notNull(),
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

export const AccountSettingSchema = createSelectSchema(accountSettings);
export type AccountSettings = z.infer<typeof AccountSettingSchema>;
