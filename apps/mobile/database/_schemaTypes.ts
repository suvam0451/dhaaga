import { z } from 'zod';

export const accountValidator = z.object({
	id: z.ostring(),
});

export type AccountValidType = z.infer<typeof accountValidator>;
