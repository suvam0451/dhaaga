import { DhaagaJsMediaCreateDTO, MediaRoute } from './_interface.js';
import { errorBuilder } from '#/adapters/_client/_router/dto/api-responses.dto.js';
import { MastoMediaAttachment } from '#/types/mastojs.types.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MastoJsWrapper } from '#/client/utils/api-wrappers.js';
import { MastoErrorHandler } from '#/client/utils/api-wrappers.js';

export class MastodonMediaRoute implements MediaRoute {
	direct: FetchWrapper;
	client: MastoJsWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MastoJsWrapper.create(forwarded.baseUrl, forwarded.token);
	}

	/**
	 * @deprecated use the React Native implementation, instead
	 * @param dto
	 */
	async create(dto: DhaagaJsMediaCreateDTO): Promise<MastoMediaAttachment> {
		const fd = new FormData();
		fd.append('file', dto.uri);

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

		return await this.client.lib.v2.media.create({
			file: dto.uri,
			thumbnail: dto.uri,
		});
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
