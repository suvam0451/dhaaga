import { DhaagaJsMediaCreateDTO, MediaRoute } from '../_router/routes/media.js';
import { Endpoints } from 'misskey-js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { DhaagaErrorCode } from '../../../types/result.types.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { MisskeyJsWrapper } from '../../../custom-clients/custom-clients.js';

export class MisskeyMediaRouter implements MediaRoute {
	direct: FetchWrapper;
	client: MisskeyJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MisskeyJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	async create(
		dto: DhaagaJsMediaCreateDTO,
	): LibraryPromise<Endpoints['drive/files/create']['res']> {
		const formData = new FormData();
		formData.append('file', dto.file);

		try {
			const data: any = await this.client.client.request<
				// @ts-ignore-next-line
				Endpoints['drive/files/create']['req'],
				any
			>('drive/files/create', formData);
			return { data };
		} catch (e) {
			console.log(e);
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}

	async updateDescription(id: string, text: string) {
		try {
			const data = await this.client.client.request('drive/files/update', {
				fileId: id,
				comment: text,
			});
			return { data };
		} catch (e: any) {
			if (e.code) {
				return errorBuilder(e.code);
			}
			console.log(e);
			return errorBuilder(DhaagaErrorCode.UNKNOWN_ERROR);
		}
	}
}
