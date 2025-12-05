import { LibraryPromise } from '#/adapters/_client/_router/routes/_types.js';
import {
	InstanceApi_CustomEmojiDTO,
	InstanceApi_SoftwareInfoDTO,
	InstanceRoute,
} from './_interface.js';
import { LibraryResponse } from '#/types/result.types.js';

export class BlueskyInstanceRouter implements InstanceRoute {
	getTranslation(id: string, lang: string): Promise<LibraryResponse<any>> {
		throw new Error('Method not implemented.');
	}
	getSoftwareInfo(
		urlLike: string,
		software?: string | undefined,
	): Promise<LibraryResponse<InstanceApi_SoftwareInfoDTO>> {
		throw new Error('Method not implemented.');
	}
	getCustomEmojis(
		urlLike: string,
	): Promise<LibraryResponse<InstanceApi_CustomEmojiDTO[]>> {
		throw new Error('Method not implemented.');
	}
	getLoginUrl(
		urlLike: string,
		{}: {
			appName: string;
			appCallback: string;
			appClientId: string;
			appClientSecret: string;
			uuid: string;
		},
	): LibraryPromise<{
		software: string;
		version?: string | null | undefined;
		loginUrl: string;
		loginStrategy: 'code' | 'miauth';
	}> {
		throw new Error('Method not implemented.');
	}
}
