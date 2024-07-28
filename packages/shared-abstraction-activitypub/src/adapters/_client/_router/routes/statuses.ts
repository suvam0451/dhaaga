import { MastoStatus, MissNote } from '../../_interface.js';
import { LibraryPromise } from './_types.js';

export interface StatusesRoute {
	get(id: string): LibraryPromise<MastoStatus | MissNote>;
}
