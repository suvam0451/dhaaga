import { z } from 'zod';

export const LemmyApiSite_Schema = z.object({
	site_view: z.object({
		site: z.object({
			id: z.number(),
			name: z.string(),
			sidebar: z.string(),
			actor_id: z.string(),
		}),
		version: z.string(),
	}),
});
