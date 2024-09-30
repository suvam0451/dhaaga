import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { integer } from 'drizzle-orm/sqlite-core/index';

export const appSettings = sqliteTable('app_setting', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	software: text('software').notNull(),
	server: text('server').notNull(),
	username: text('username').notNull(),
	createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

export const AppSettingSchema = createSelectSchema(appSettings);
export type AppSettings = z.infer<typeof AppSettingSchema>;
