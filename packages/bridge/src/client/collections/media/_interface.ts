import { DriveFile } from 'misskey-js/autogen/models.js';
import { MastoMediaAttachment } from '#/types/mastojs.types.js';
import { DhaagaJsMediaCreateDTO } from '#/client/typings.js';

export interface MediaRoute {
	create(
		dto: DhaagaJsMediaCreateDTO,
	): Promise<MastoMediaAttachment | DriveFile>;

	updateDescription(id: string, text: string): Promise<any>;
}
