import { MediaRoute } from './_interface.js';
import { Endpoints } from 'misskey-js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MisskeyJsWrapper } from '#/client/utils/api-wrappers.js';
import { getHumanReadableError } from '#/utils/errors.js';
import { DhaagaJsMediaCreateDTO } from '#/client/typings.js';

export class MisskeyMediaRouter implements MediaRoute {
	direct: FetchWrapper;
	client: MisskeyJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MisskeyJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	/**
	 * @deprecated use the React Native implementation, instead
	 * @param dto
	 */
	async create(
		dto: DhaagaJsMediaCreateDTO,
	): Promise<Endpoints['drive/files/create']['res']> {
		const formData = new FormData();
		formData.append('file', dto.file);

		const data: any = await this.client.client.request<
			// @ts-ignore-next-line
			Endpoints['drive/files/create']['req'],
			any
		>('drive/files/create', formData);
		return data;
	}

	async updateDescription(id: string, text: string) {
		try {
			const data = await this.client.client.request('drive/files/update', {
				fileId: id,
				comment: text,
			});
			return { data };
		} catch (e: any) {
			throw new Error(getHumanReadableError(e));
		}
	}
}
