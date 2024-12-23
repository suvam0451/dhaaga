import { DhaagaJsMediaCreateDTO, MediaRoute } from '../_router/routes/media.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { MastoErrorHandler } from '../_router/_runner.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { MastoMediaAttachment } from '../../../types/mastojs.types.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { MastoJsWrapper } from '../../../custom-clients/custom-clients.js';

export class MastodonMediaRoute implements MediaRoute {
	direct: FetchWrapper;
	client: MastoJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MastoJsWrapper.create(forwarded.baseUrl, forwarded.token);
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
					Authorization: `Bearer ${this.direct.token}`,
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
			const data = await this.client.lib.v2.media.create({
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
		const fn = this.client.lib.v1.media.$select(id).update;
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
