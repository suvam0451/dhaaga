import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';

export const activitypubTag = sqliteTable('activitypub_tag', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	following: integer('following', { mode: 'boolean' }).notNull(),
	privatelyFollowing: integer('privately_following', { mode: 'boolean' }),
});

export const activitypubTagCreateDto = z.object({
	name: z.string(),
	following: z.oboolean(),
	privatelyFollowing: z.boolean(),
});

export type A = z.infer<typeof activitypubTagCreateDto>;

export const AccountHashtagSchema = createSelectSchema(activitypubTag);
export type B = z.infer<typeof AccountHashtagSchema>;
