import { DataSource } from '@dhaaga/db';
import { RandomUtil } from '@dhaaga/bridge';

export type TimelineReducerBaseState<T> = {
	db: DataSource | null;
	sessionId: string;

	// the first set of results has not been fetched
	isFirstLoad: boolean;

	// no more results available
	isEol: boolean;

	// track cursors
	minId: string | null;
	maxId: string | null;

	opts: { limit: number; q?: string };

	items: T[];

	// dedup
	seen: Set<string>;

	/**
	 * Applies maxId cursor
	 *
	 * Updating this value will result in
	 * fetching the next set of data
	 */
	appliedMaxId: string | null;
};

export const timelineReducerBaseDefaults: TimelineReducerBaseState<unknown> = {
	db: null,
	sessionId: RandomUtil.nanoId(),
	isEol: false,
	opts: { limit: 20 },
	isFirstLoad: true,
	items: [],
	seen: new Set<string>(),
	minId: null,
	maxId: null,
	appliedMaxId: null,
};
