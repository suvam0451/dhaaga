import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import {
	AppMessageDtoService,
	AppMessageObject,
	appMessageObjectSchema,
} from '../../types/app-message.types';
import { AppPostObject } from '../../types/app-post.types';

export class ChatMiddleware {
	static deserialize(input: any, driver: KNOWN_SOFTWARE, server: string) {
		return ChatMiddleware.rawToJson(input, { driver, server });
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
		return data as AppPostObject;
	}
}
