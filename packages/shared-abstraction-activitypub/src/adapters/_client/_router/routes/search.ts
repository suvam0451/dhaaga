import { LibraryPromise } from './_types.js';
import {
	MastoAccount,
	MastoStatus,
	MegaAccount,
	MegaStatus,
} from '../../_interface.js';
import { Endpoints } from 'misskey-js';

export type MastoUnifiedSearchType = {
	q: string;
	following?: boolean;
	type?: 'accounts' | 'hashtags' | 'statuses';
	resolve?: boolean;
	offset?: number;
	minId?: string;
	maxId?: string;
	accountId?: string;
};

export type DhaagaJsUserSearchDTO = {
	origin?: 'combined' | 'local' | 'remote';
	allowPartial?: boolean;
	limit: number;
	query: string;
} & MastoUnifiedSearchType;

export type DhaagaJsPostSearchDTO = {
	allowPartial?: true;
	filetype?: null | 'image' | 'video' | 'audio';
	limit: number;
	order?: 'asc' | 'desc';
	host?: string; // "." for local
	query: string;
	userId?: null;
	sinceId?: string;
	untilId?: string;
} & MastoUnifiedSearchType;

export interface SearchRoute {
	findUsers(
		q: DhaagaJsUserSearchDTO,
	): LibraryPromise<
		MastoAccount[] | Endpoints['users/search']['res'] | MegaAccount[]
	>;

	findPosts(
		q: DhaagaJsPostSearchDTO,
	): LibraryPromise<
		MastoStatus[] | Endpoints['notes/search']['res'] | MegaStatus[]
	>;
}
