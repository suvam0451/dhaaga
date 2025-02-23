import { z } from 'zod';

export const userFindQuerySchema = z
	.object({
		use: z.literal('did'),
		did: z.string(),
	})
	.or(
		z.object({
			use: z.literal('userId'),
			userId: z.string(),
		}),
	)
	.or(
		z.object({
			use: z.literal('handle'),
			handle: z.string(),
		}),
	)
	.or(
		z.object({
			use: z.literal('webfinger'),
			webfinger: z.object({
				username: z.string(),
				host: z.string().nullable(),
			}),
		}),
	);

export type DriverUserFindQueryType = z.infer<typeof userFindQuerySchema>;
