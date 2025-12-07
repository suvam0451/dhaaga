import { TrendsRoute } from './_interface.js';
import {
	MastoStatus,
	MastoTag,
	MastoTrendLink,
} from '#/types/mastojs.types.js';
import FetchWrapper from '#/client/utils/fetch.js';

export class PleromaTrendsRouter implements TrendsRoute {
	client: FetchWrapper;

	constructor(forwarded: FetchWrapper) {
		this.client = forwarded;
	}

	async tags(): Promise<MastoTag[]> {
		throw new Error('pleroma does not support trends');
	}

	async posts(): Promise<MastoStatus[]> {
		throw new Error('pleroma does not support trends');
	}

	async links(): Promise<MastoTrendLink[]> {
		throw new Error('pleroma does not support trends');
	}
}
