import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { account } from './account';

export const accountMetadata = sqliteTable('account_metadata', {
	id: text('id')
		.$defaultFn(() => createId())
		.notNull(),
	key: text('key').notNull(),
	value: text('value').notNull(),
	accountId: integer('account_id')
		.notNull()
		.references(() => account.id),
});

export const accountMetadata_Relations = relations(
	accountMetadata,
	({ one }) => ({
		account: one(account, {
			fields: [accountMetadata.accountId],
			references: [account.id],
		}),
	}),
);

export const AccountMetadataSchema = createSelectSchema(accountMetadata);
export type AccountMetadata = z.infer<typeof AccountMetadataSchema>;
