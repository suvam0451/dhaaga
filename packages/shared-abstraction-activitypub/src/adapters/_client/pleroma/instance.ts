import { DhaagaErrorCode, LibraryResponse } from '../_router/_types.js';
import {
	InstanceApi_CustomEmojiDTO,
	InstanceRoute,
} from '../_router/routes/instance.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import { getSoftwareInfoShared } from '../_router/shared.js';
import {
	DhaagaPleromaClient,
	PleromaErrorHandler,
} from '../_router/_runner.js';
import { LibraryPromise } from '../_router/routes/_types.js';

export class PleromaInstanceRouter implements InstanceRoute {
	client: RestClient;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
	}

	getLoginUrl(
		urlLike: string,
		{}: { appName: string; appCallback: string; uuid: string },
	): LibraryPromise<{
		software: string;
		version?: string | null | undefined;
		loginUrl: string;
		loginStrategy: 'code' | 'miauth';
	}> {
		throw new Error('Method not implemented.');
	}

	getTranslation(id: string, lang: string): Promise<LibraryResponse<any>> {
		throw new Error('Method not implemented.');
	}

	getSoftwareInfo(urlLike: string) {
		return getSoftwareInfoShared(urlLike);
	}

	async getCustomEmojis(
		urlLike: string,
	): Promise<LibraryResponse<InstanceApi_CustomEmojiDTO[]>> {
		const x = DhaagaPleromaClient(urlLike).client;
		try {
			const { data, error } = await PleromaErrorHandler(
				x,
				x.getInstanceCustomEmojis,
			);
			const dt = await data;

			if (error) return { error };
			return {
				data: dt!.data.map((o) => ({
					shortCode: o.shortcode,
					url: o.url,
					staticUrl: o.static_url,
					visibleInPicker: o.visible_in_picker,
					category: o.category,
					aliases: [],
					tags: [],
				})),
			};
		} catch (e: any) {
			if (e?.response?.data?.error?.code) {
				const code = e?.response?.data?.error?.code;
				return {
					statusCode: e?.response?.status,
					error: {
						code,
						message: code,
					},
				};
			} else {
				return {
					statusCode: e?.response?.status,
					error: {
						code: DhaagaErrorCode.UNKNOWN_ERROR,
						message: e,
					},
				};
			}
		}
	}
}
