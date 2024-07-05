import type { mastodon } from 'masto';
import { LibraryResponse } from './_types';

export interface InstanceRoute {
	getTranslation(
		id: string,
		lang: string,
	): Promise<LibraryResponse<mastodon.v1.Translation>>;
}
