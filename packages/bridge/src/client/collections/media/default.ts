import { DhaagaJsMediaCreateDTO, MediaRoute } from './_interface.js';
import { MastoMediaAttachment } from '#/types/mastojs.types.js';

export class DefaultMediaRoute implements MediaRoute {
	async create(dto: DhaagaJsMediaCreateDTO): Promise<MastoMediaAttachment> {
		throw new Error('method not implemented');
	}

	async updateDescription(id: string, text: string) {
		throw new Error('method not implemented');
	}
}
