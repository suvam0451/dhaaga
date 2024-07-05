import { DhaagaErrorCode, LibraryResponse } from '../_router/_types';
import { InstanceApi_CustomEmojiDTO, InstanceRoute } from '../_router/instance';
import { RestClient } from '@dhaaga/shared-provider-mastodon/src';
import { getSoftwareInfoShared } from '../_router/shared';
import { DhaagaPleromaClient, PleromaErrorHandler } from '../_router/_runner';

export class PleromaInstanceRouter implements InstanceRoute {
	client: RestClient;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
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
		console.log(x);
		try {
			const { data, error } = await PleromaErrorHandler(
				x,
				x.getInstanceCustomEmojis,
			);
			const dt = await data;
			console.log(dt!.data);

			if (error) return { error };
			return {
				data: dt!.data.map((o) => ({
					shortCode: o.shortcode,
					url: o.url,
					staticUrl: o.static_url,
					visibleInPicker: o.visible_in_picker,
					category: o.category,
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
