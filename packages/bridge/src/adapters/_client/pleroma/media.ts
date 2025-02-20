import { DhaagaJsMediaCreateDTO, MediaRoute } from '../_router/routes/media.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { errorBuilder } from '../_router/dto/api-responses.dto.js';
import { MastoMediaAttachment } from '../../../types/mastojs.types.js';
import FetchWrapper from '../../../custom-clients/custom-fetch.js';
import { MegalodonPleromaWrapper } from '../../../custom-clients/custom-clients.js';
import { CasingUtil } from '../../../utils/casing.js';

export class PleromaMediaRoute implements MediaRoute {
	direct: FetchWrapper;
	client: MegalodonPleromaWrapper;

	constructor(forwarded: FetchWrapper) {
		this.direct = forwarded;
		this.client = MegalodonPleromaWrapper.create(
			forwarded.baseUrl,
			forwarded.token,
		);
	}

	async create(
		dto: DhaagaJsMediaCreateDTO,
	): LibraryPromise<MastoMediaAttachment> {
		const data = await this.client.client.uploadMedia(dto.file);
		return { data: data as any };
	}

	async updateDescription(id: string, text: string) {
		const data = await this.client.client.updateMedia(id, {
			description: text,
		});
		if (data.status !== 200) {
			console.log(data.statusText);
			return errorBuilder(data.statusText);
		}
		return { data: CasingUtil.camelCaseKeys(data.data) };
	}
}
