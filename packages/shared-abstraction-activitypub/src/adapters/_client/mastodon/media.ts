import { DhaagaJsMediaCreateDTO, MediaRoute } from '../_router/routes/media.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMastoClient,
	DhaagaRestClient,
	MastoErrorHandler,
} from '../_router/_runner.js';
import { MastoMediaAttachment } from '../_interface.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';

export class MastodonMediaRoute implements MediaRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MASTOJS>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMastoClient(this.client.url, this.client.accessToken);
	}

	async create(
		dto: DhaagaJsMediaCreateDTO,
	): LibraryPromise<MastoMediaAttachment> {
		const fd = new FormData();
		fd.append('file', dto.uri);

		try {
			const data = await fetch('https://mastodon.social/api/v1/media', {
				method: 'POST',
				body: fd,
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${this.client.accessToken}`,
				},
			}).then((res) => {
				if (res.ok) {
					console.log('lgtm');
				} else {
					console.log(res.statusText, res.status);
				}
			});
			console.log(data);
		} catch (e) {
			console.log(e);
		}

		try {
			const data = await this.lib.client.v2.media.create({
				file: dto.uri,
				thumbnail: dto.uri,
			});
			return { data };
		} catch (e) {
			console.log(e);
			return errorBuilder();
		}
		// const { data, error } = await MastoErrorHandler(fn, [{ file: dto.file }]);
		// if (error || !data) return errorBuilder(error);
		// const retData = await data;
		// return { data: retData };
	}

	async updateDescription(id: string, text: string) {
		const fn = this.lib.client.v1.media.$select(id).update;
		const { data, error } = await MastoErrorHandler(fn, [
			{
				description: text,
			},
		]);
		if (error || !data) return errorBuilder(error);
		const resData = await data;
		return { data: resData };
	}
}
