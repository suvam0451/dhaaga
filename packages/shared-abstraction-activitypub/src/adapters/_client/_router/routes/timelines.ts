import { LibraryResponse } from '../_types.js';
import { MastoStatus } from '../../_interface.js';

export type TimelineGetQuery = {
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
};

export interface TimelinesRoute {
	home(query: TimelineGetQuery): Promise<LibraryResponse<MastoStatus[]>>;

	public(query: TimelineGetQuery): Promise<LibraryResponse<MastoStatus[]>>;

	publicAsGuest(
		urlLike: string,
		query: TimelineGetQuery,
	): Promise<LibraryResponse<MastoStatus[]>>;

	federated(query: TimelineGetQuery): Promise<LibraryResponse<MastoStatus[]>>;

	federatedAsGuest(
		urlLike: string,
		query: TimelineGetQuery,
	): Promise<LibraryResponse<MastoStatus[]>>;

	hashtag(
		q: string,
		query: TimelineGetQuery,
	): Promise<LibraryResponse<MastoStatus[]>>;

	hashtagAsGuest(
		urlLike: string,
		q: string,
		query: TimelineGetQuery,
	): Promise<LibraryResponse<MastoStatus[]>>;

	list(
		q: string,
		query: TimelineGetQuery,
	): Promise<LibraryResponse<MastoStatus[]>>;
}
