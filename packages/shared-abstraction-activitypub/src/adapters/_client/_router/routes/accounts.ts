import { LibraryResponse } from '../_types.js';
import { mastodon } from 'masto';
import { Note } from 'misskey-js/autogen/models.js';
import { Endpoints } from 'misskey-js';

type ListAccountStatusesParams = {
	// masto.js
	readonly onlyMedia?: boolean | null;
	readonly pinned?: boolean | null;
	readonly excludeReplies?: boolean | null;
	readonly excludeReblogs?: boolean | null;
	readonly tagged?: string | null;
};

export type AccountRouteStatusQueryDto = ListAccountStatusesParams &
	Endpoints['users/notes']['req'];

export interface AccountRoute {
	statuses(
		id: string,
		params: AccountRouteStatusQueryDto,
	): Promise<LibraryResponse<mastodon.v1.Status[] | Note[] | any[]>>;
}
