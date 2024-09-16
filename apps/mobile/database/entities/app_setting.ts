import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';
import { sql } from 'drizzle-orm';
import { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';

export const appSettings = sqliteTable('app_setting', {
	id: text('id')
		.$defaultFn(() => createId())
		.notNull(),
	software: text('software').notNull(),
	server: text('server').notNull(),
	username: text('username').notNull(),
	createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const AppSettingSchema = createSelectSchema(appSettings);
export type AppSettings = z.infer<typeof AppSettingSchema>;
