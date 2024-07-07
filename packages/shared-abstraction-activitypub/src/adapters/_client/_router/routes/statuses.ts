import { LibraryResponse } from '../_types.js';
import { MastoStatus } from '../../_interface.js';

export interface StatusesRoute {
	get(id: string): Promise<LibraryResponse<MastoStatus>>;
}
