import { z } from 'zod';

const appMessageObjectSchema = z.object({
	uuid: z.string(),
	id: z.string(),
	sender: z.object({
		id: z.string(),
	}),
	content: z.object({
		raw: z.string().nullable().optional(),
	}),
	createdAt: z.string(),
});

/**
 * Typings for a message object used mostly
 * in the Notifications -> Chat section
 *
 * The object is validated to contain no errors
 */
type MessageObjectType = z.infer<typeof appMessageObjectSchema>;

export { appMessageObjectSchema };
export type { MessageObjectType };
