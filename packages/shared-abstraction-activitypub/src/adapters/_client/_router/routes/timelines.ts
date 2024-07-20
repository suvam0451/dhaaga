import { LibraryResponse } from '../_types.js';
import { MastoStatus } from '../../_interface.js';

export type DhaagaJsTimelineQueryOptions = {
	limit: number;
	sinceId?: string;
	maxId?: string;
	minId?: string;

	// most timelines
	onlyMedia?: boolean;

	// public timeline
	remote?: boolean;
	local?: boolean;

	// hashtag only
	any?: string[];
	all?: string[];
	none?: string[];

	// user statuses
	pinned?: boolean | null;
	excludeReplies?: boolean | null;
	excludeReblogs?: boolean | null;
	tagged?: string | null;
};

export interface TimelinesRoute {
	home(
		query: DhaagaJsTimelineQueryOptions,
	): Promise<LibraryResponse<MastoStatus[]>>;

	public(
		query: DhaagaJsTimelineQueryOptions,
	): Promise<LibraryResponse<MastoStatus[]>>;

	publicAsGuest(
		urlLike: string,
		query: DhaagaJsTimelineQueryOptions,
	): Promise<LibraryResponse<MastoStatus[]>>;

	hashtag(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): Promise<LibraryResponse<MastoStatus[]>>;

	hashtagAsGuest(
		urlLike: string,
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): Promise<LibraryResponse<MastoStatus[]>>;

	list(
		q: string,
		query: DhaagaJsTimelineQueryOptions,
	): Promise<LibraryResponse<MastoStatus[]>>;
}
