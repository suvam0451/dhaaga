import { InstanceApi_CustomEmojiDTO, InstanceRoute } from './_interface.js';
import { getSoftwareInfoShared } from '#/adapters/_client/_router/shared.js';
import { PleromaErrorHandler } from '#/adapters/_client/_router/_runner.js';
import { LibraryPromise } from '#/adapters/_client/_router/routes/_types.js';
import { ApiErrorCode, LibraryResponse } from '#/types/result.types.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MegalodonPleromaWrapper } from '#/client/utils/custom-clients.js';

export class PleromaInstanceRouter implements InstanceRoute {
	direct: FetchWrapper;
	client: MegalodonPleromaWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MegalodonPleromaWrapper.create(
			forwarded.baseUrl,
			forwarded.token,
		);
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
		const x = MegalodonPleromaWrapper.create(urlLike).client;
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
						code: ApiErrorCode.UNKNOWN_ERROR,
						message: e,
					},
				};
			}
		}
	}
}
