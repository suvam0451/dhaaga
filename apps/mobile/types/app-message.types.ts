import { z } from 'zod';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { RandomUtil } from '../utils/random.utils';

export const appMessageObjectSchema = z.object({
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
export type AppMessageObject = z.infer<typeof appMessageObjectSchema>;

export class AppMessageDtoService {
	ref: AppMessageObject;

	constructor(ref: AppMessageObject) {
		this.ref = ref;
	}

	static export(
		input: any,
		driver: KNOWN_SOFTWARE | string,
		server: string,
	): AppMessageObject {
		if (!input) return null;
		if (driver !== KNOWN_SOFTWARE.BLUESKY) return null;

		return {
			uuid: RandomUtil.nanoId(),
			id: input.id,
			sender: {
				id: input?.sender?.did,
			},
			createdAt: input.sentAt,
			content: {
				raw: input.text,
			},
		};
	}
}
