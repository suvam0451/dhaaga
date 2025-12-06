import { z } from 'zod';
import { ApiTargetInterface } from '#/client/index.js';

const DriverWebfingerSchema = z.object({
	username: z.string(),
	host: z.string().nullable(),
});

type DriverWebfingerType = z.infer<typeof DriverWebfingerSchema>;

const userFindQuerySchema = z
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
			webfinger: DriverWebfingerSchema,
		}),
	);

type DriverUserFindQueryType = z.infer<typeof userFindQuerySchema>;

export { userFindQuerySchema };
export type { DriverWebfingerType, DriverUserFindQueryType };

function lookup(client: ApiTargetInterface) {}

export default lookup;
