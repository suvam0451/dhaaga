import { LibraryPromise } from './_types.js';
import { DriveFile } from 'misskey-js/autogen/models.js';
import { MastoMediaAttachment } from '../../_interface.js';

export type DhaagaJsMediaCreateDTO = {
	file: Blob;
	filename?: string;
	force: boolean;
	uri: string;
	name: string;
	type: string;
};

export interface MediaRoute {
	create(
		dto: DhaagaJsMediaCreateDTO,
	): LibraryPromise<MastoMediaAttachment | DriveFile>;
}
