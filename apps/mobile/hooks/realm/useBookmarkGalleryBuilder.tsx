import { useActivityPubRestClientContext } from '../../states/useActivityPubRestClient';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Account } from '../../entities/account.entity';
// import { useQuery } from '@realm/react';
import { ActivityPubUser } from '../../entities/activitypub-user.entity';
import { ActivityPubStatus } from '../../entities/activitypub-status.entity';
import { ActivityPubTag } from '../../entities/activitypub-tag.entity';

export type GalleryUserAggregationItem = {
	user: ActivityPubUser;
	posts: ActivityPubStatus[];
	count: number;
};

export type GalleryTagAggregationItem = {
	tag: ActivityPubTag;
	posts: ActivityPubStatus[];
	count: number;
};

type Props = {
	q: string;
	limit: number;
	offset: number;
};

function useBookmarkGalleryBuilder({ q, limit, offset }: Props) {
	const { primaryAcct } = useActivityPubRestClientContext();
	// const acct: Account = useQuery(Account).find(
	// 	(o) => o._id.toString() === primaryAcct._id.toString(),
	// );

	const LoadedUserData = useRef<GalleryUserAggregationItem[] | null>(null);
	const LoadedTagData = useRef<GalleryTagAggregationItem[] | null>(null);

	const [UserFilters, setUserFilters] = useState([]);
	const [TagFilters, setTagFilters] = useState([]);

	useEffect(() => {
		let start = performance.now();
		const acctLookup = new Map<string, ActivityPubUser>();
		const acctBookmarks = new Map<string, ActivityPubStatus[]>();
		const tagLookup = new Map<string, ActivityPubTag>();
		const tagBookmarks = new Map<string, ActivityPubStatus[]>();

		for (const acctBookmark of []) {
			const k = acctBookmark.postedBy.userId;
			if (!acctLookup.has(k)) {
				acctLookup.set(k, acctBookmark.postedBy);
				acctBookmarks.set(k, [acctBookmark]);
			} else {
				acctBookmarks.get(k).push(acctBookmark);
			}

			// push to every relevant tag
			for (const tag of acctBookmark.hashtags) {
				const kk = tag.name;
				if (!tagLookup.has(kk)) {
					tagLookup.set(kk, tag);
					tagBookmarks.set(kk, [acctBookmark]);
				} else {
					tagBookmarks.get(kk).push(acctBookmark);
				}
			}
		}

		const accounts: GalleryUserAggregationItem[] = [];

		const tags: GalleryTagAggregationItem[] = [];

		// @ts-ignore
		for (let [k, v] of acctLookup.entries()) {
			const _u = acctLookup.get(k);
			const _posts = acctBookmarks.get(k);
			accounts.push({
				user: _u,
				posts: _posts,
				count: _posts.length,
			});
		}
		const usersSorted = accounts.sort((a, b) => b.count - a.count);

		// @ts-ignore
		for (let [k, v] of tagLookup.entries()) {
			const _u = tagLookup.get(k);
			const _posts = tagBookmarks.get(k);
			tags.push({
				tag: _u,
				posts: _posts,
				count: _posts.length,
			});
		}
		const sortedTags = tags.sort((a, b) => b.count - a.count);

		LoadedUserData.current = usersSorted;
		LoadedTagData.current = sortedTags;

		let end = performance.now();
		console.log('[PERF]: bookmarks loaded in', end - start, 'ms');
	}, [q]);

	const postsToShow = useMemo(() => {
		return [];
		// return acct.bookmarks.slice(offset, offset + limit);
	}, [LoadedUserData, offset, limit]);

	return {
		// acct,
		postsToShow,
		LoadedData: LoadedUserData,
		LoadedTagData,
		isBuilding: LoadedUserData === null,
		UserFilters,
		setUserFilters,
		TagFilters,
		setTagFilters,
	};
}

export default useBookmarkGalleryBuilder;
