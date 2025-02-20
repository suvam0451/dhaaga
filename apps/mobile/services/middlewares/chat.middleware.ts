import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import {
	AppMessageDtoService,
	AppMessageObject,
	appMessageObjectSchema,
} from '../../types/app-message.types';
import type { PostObjectType } from '@dhaaga/core';

export class ChatMiddleware {
	static deserialize<T>(
		input: T | T[],
		driver: KNOWN_SOFTWARE,
		server: string,
	): T extends unknown[] ? AppMessageObject[] : AppMessageObject {
		if (Array.isArray(input)) {
			return input
				.filter((o) => !!o)
				.map((o) =>
					ChatMiddleware.rawToJson(o, {
						driver,
						server,
					}),
				) as unknown as T extends unknown[] ? AppMessageObject[] : never;
		} else {
			return ChatMiddleware.rawToJson(input, {
				driver,
				server,
			}) as unknown as T extends unknown[] ? never : AppMessageObject;
		}
	}

	static rawToJson(
		input: any,
		{
			driver,
			server,
		}: {
			driver: KNOWN_SOFTWARE | string;
			server: string;
		},
	): AppMessageObject {
		// prevent infinite recursion
		if (!input) return null;
		if (driver !== KNOWN_SOFTWARE.BLUESKY) return null;

		const exported = AppMessageDtoService.export(input, driver, server);
		const { data, error, success } = appMessageObjectSchema.safeParse(exported);
		if (!success) {
			console.log('[ERROR]: status item dto validation failed', error);
			console.log('[INFO]: generated object', exported);
			input.print();
			return null;
		}
		return data as PostObjectType;
	}
}
