import { DhaagaJsMediaCreateDTO, MediaRoute } from '../_router/routes/media.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMisskeyClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import { Endpoints } from 'misskey-js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { DhaagaErrorCode } from '../_router/_types.js';

export class MisskeyMediaRouter implements MediaRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MISSKEYJS>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMisskeyClient(this.client.url, this.client.accessToken);
	}

	async create(
		dto: DhaagaJsMediaCreateDTO,
	): LibraryPromise<Endpoints['drive/files/create']['res']> {
		// folderId?: string | null;
		// name?: string | null;
		// comment?: string | null;
		// isSensitive?: boolean;
		// force?: boolean;
		// file: string;

		const formData = new FormData();
		formData.append('file', dto.file);

		try {
			const data: any = await this.lib.client.request<
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
			const data = await this.lib.client.request('drive/files/update', {
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
