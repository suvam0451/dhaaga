import { DhaagaJsMediaCreateDTO, MediaRoute } from '../_router/routes/media.js';
import { LibraryPromise } from '../_router/routes/_types.js';
import { MastoMediaAttachment } from '../_interface.js';
import { notImplementedErrorBuilder } from '../_router/dto/api-responses.dto.js';

export class DefaultMediaRoute implements MediaRoute {
	async create(
		dto: DhaagaJsMediaCreateDTO,
	): LibraryPromise<MastoMediaAttachment> {
		return notImplementedErrorBuilder();
	}

	async updateDescription(id: string, text: string) {
		return notImplementedErrorBuilder();
	}
}
