import { DhaagaJsMediaCreateDTO, MediaRoute } from './_interface.js';
import { MastoMediaAttachment } from '#/types/mastojs.types.js';
import FetchWrapper from '#/client/utils/fetch.js';
import { MegalodonPleromaWrapper } from '#/client/utils/api-wrappers.js';
import { CasingUtil } from '#/utils/casing.js';

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

	async create(dto: DhaagaJsMediaCreateDTO): Promise<MastoMediaAttachment> {
		return this.client.client.uploadMedia(dto.file) as any;
	}

	async updateDescription(id: string, text: string) {
		const data = await this.client.client.updateMedia(id, {
			description: text,
		});
		if (data.status !== 200) throw new Error(data.statusText);

		return { data: CasingUtil.camelCaseKeys(data.data) };
	}
}
