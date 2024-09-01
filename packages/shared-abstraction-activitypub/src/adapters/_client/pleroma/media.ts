import { DhaagaJsMediaCreateDTO, MediaRoute } from '../_router/routes/media.js';
import { RestClient } from '@dhaaga/shared-provider-mastodon';
import {
	COMPAT,
	DhaagaMegalodonClient,
	DhaagaRestClient,
} from '../_router/_runner.js';
import { KNOWN_SOFTWARE } from '../_router/routes/instance.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { MastoMediaAttachment } from '../_interface.js';
import {
	errorBuilder,
	notImplementedErrorBuilder,
} from '../_router/dto/api-responses.dto.js';
import camelcaseKeys from 'camelcase-keys';

export class PleromaMediaRoute implements MediaRoute {
	client: RestClient;
	lib: DhaagaRestClient<COMPAT.MEGALODON>;

	constructor(forwarded: RestClient) {
		this.client = forwarded;
		this.lib = DhaagaMegalodonClient(
			KNOWN_SOFTWARE.PLEROMA,
			this.client.url,
			this.client.accessToken,
		);
	}

	async create(
		dto: DhaagaJsMediaCreateDTO,
	): LibraryPromise<MastoMediaAttachment> {
		const data = await this.lib.client.uploadMedia(dto.file);
		return { data: data as any };
	}

	async updateDescription(id: string, text: string) {
		const data = await this.lib.client.updateMedia(id, {
			description: text,
		});
		if (data.status !== 200) {
			console.log(data.statusText);
			return errorBuilder(data.statusText);
		}
		return { data: camelcaseKeys(data.data) };
	}
}
