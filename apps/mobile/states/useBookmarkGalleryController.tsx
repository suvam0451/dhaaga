import useBookmarkGalleryBuilder, {
	GalleryTagAggregationItem,
	GalleryUserAggregationItem,
} from '../hooks/realm/useBookmarkGalleryBuilder';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { RandomUtil } from '@dhaaga/core';
import { Account } from '../database/_schema';

type InheritedType = {};

type Type = {
	posts: any[];
	acct: Account;
	loadedUserData: GalleryUserAggregationItem[];
	loadedTagData: GalleryTagAggregationItem[];
	isBuilding: boolean;
	isRefreshing: boolean;

	isUserSelected: (_id) => boolean;
	isTagSelected: (_id) => boolean;

	onUserSelected: (_id) => void;
	onTagSelected: (_Id) => void;

	userStateHash: string;
	tagStateHash: string;

	loadMore: () => void;

	onUserAllSelected: () => void;
	onUserNoneSelected: () => void;
	onTagAllSelected: () => void;
	onTagNoneSelected: () => void;

	IsUserAllSelected: boolean;
	IsUserNoneSelected: boolean;

	IsTagAllSelected: boolean;
	IsTagNoneSelected: boolean;

	postsTotalCount: number;
	usersTotalCount: number;
} & InheritedType;

const defaultValue: Type = {
	acct: null,
	loadedUserData: [],
	loadedTagData: [],
	isUserSelected: function (_id): boolean {
		throw new Error('Function not implemented.');
	},
	isTagSelected: function (_id): boolean {
		throw new Error('Function not implemented.');
	},
	onUserSelected: function (_id): void {
		throw new Error('Function not implemented.');
	},
	onTagSelected: function (_Id): void {
		throw new Error('Function not implemented.');
	},
	onUserAllSelected: function (): void {
		throw new Error('Function not implemented.');
	},
	onUserNoneSelected: function (): void {
		throw new Error('Function not implemented.');
	},
	onTagAllSelected: function (): void {
		throw new Error('Function not implemented.');
	},
	onTagNoneSelected: function (): void {
		throw new Error('Function not implemented.');
	},
	IsUserAllSelected: false,
	IsUserNoneSelected: false,
	IsTagAllSelected: false,
	IsTagNoneSelected: false,
	isBuilding: false,
	isRefreshing: false,
	posts: [],
	loadMore: function (): void {
		throw new Error('Function not implemented.');
	},
	userStateHash: '',
	tagStateHash: '',
	postsTotalCount: 0,
	usersTotalCount: 0,
};

const BookmarkGalleryControllerContext = createContext<Type>(defaultValue);

export function useBookmarkGalleryControllerContext() {
	return useContext(BookmarkGalleryControllerContext);
}

type Props = {
	children: any;
} & InheritedType;

type SpecialAction = 'all' | 'none' | null;

function WithBookmarkGalleryControllerContext({ children }: Props) {
	const [UserStateHash, setUserStateHash] = useState(RandomUtil.nanoId());
	const UserSpecialSelection = useRef<SpecialAction>('all');
	const TagSpecialSelection = useRef<SpecialAction>('all');

	const [Query, setQuery] = useState('');

	const [TagStateHash, setTagStateHash] = useState(RandomUtil.nanoId());

	const userSet = useRef(new Set<string>());
	const tagSet = useRef(new Set<string>());
	const [PostsToShow, setPostsToShow] = useState(10);
	const [IsLoading, setIsLoading] = useState(false);

	const { acct, LoadedData, LoadedTagData, isBuilding } =
		useBookmarkGalleryBuilder({
			q: Query,
			offset: 0,
			limit: PostsToShow,
		});

	const postsCached = useMemo(() => {
		return acct.bookmarks.filter((o) => {
			switch (UserSpecialSelection.current) {
				case 'all':
					return true;
				case 'none':
					return false;
				default: {
					return userSet.current.has(o.postedBy._id.toString());
				}
			}
		});
	}, [LoadedData, LoadedTagData, UserStateHash]);

	const PreviousUserStateHash = useRef(null);
	const [Posts, setPosts] = useState([]);
	useEffect(() => {
		if (PreviousUserStateHash.current === UserStateHash) {
			setPosts(postsCached.slice(0, PostsToShow));
			return;
		}
		setPosts([]);
		setIsLoading(true);
		setTimeout(() => {
			setPosts(postsCached.slice(0, PostsToShow));
			setIsLoading(false);
		}, 200);
		PreviousUserStateHash.current = UserStateHash;
	}, [postsCached, PostsToShow]);

	const IsPaginationEnabled = useRef(true);

	const loadMore = useCallback(() => {
		if (!IsPaginationEnabled.current) return;
		IsPaginationEnabled.current = false;

		setPostsToShow((PostsToShow) => PostsToShow + 10);

		setTimeout(() => {
			IsPaginationEnabled.current = true;
		}, 500);
	}, [IsPaginationEnabled.current]);

	const isUserSelected = useCallback((_id) => {
		switch (UserSpecialSelection.current) {
			case 'all':
				return true;
			case 'none':
				return false;
			default: {
				return userSet.current.has(_id.toString());
			}
		}
	}, []);

	const isTagSelected = useCallback((_id) => {
		switch (TagSpecialSelection.current) {
			case 'all': {
				return true;
			}
			case 'none': {
				return false;
			}
			default: {
				return tagSet.current.has(_id.toString());
			}
		}
	}, []);

	const onUserAllSelected = useCallback(() => {
		UserSpecialSelection.current = 'all';
		userSet.current.clear();
		setUserStateHash(RandomUtil.nanoId());
	}, []);

	const onUserNoneSelected = useCallback(() => {
		UserSpecialSelection.current = 'none';
		userSet.current.clear();
		setUserStateHash(RandomUtil.nanoId());
	}, []);

	const onTagAllSelected = useCallback(() => {
		TagSpecialSelection.current = 'all';
		tagSet.current.clear();
		setUserStateHash(RandomUtil.nanoId());
	}, []);

	const onTagNoneSelected = useCallback(() => {
		TagSpecialSelection.current = 'none';
		tagSet.current.clear();
		setUserStateHash(RandomUtil.nanoId());
	}, []);

	const onUserSelected = useCallback((_id) => {
		if (
			UserSpecialSelection.current === 'all' ||
			UserSpecialSelection.current === 'none'
		) {
			userSet.current.clear();
			userSet.current.add(_id.toString());
		} else {
			if (userSet.current.has(_id.toString())) {
				userSet.current.delete(_id.toString());
			} else {
				userSet.current.add(_id.toString());
			}
		}
		if (UserSpecialSelection.current !== null)
			UserSpecialSelection.current = null;
		setUserStateHash(RandomUtil.nanoId());
	}, []);

	function onTagSelected(_id) {}

	const IsUserAllSelected = useMemo(() => {
		return UserSpecialSelection.current === 'all';
	}, [UserSpecialSelection, UserStateHash]);

	const IsUserNoneSelected = useMemo(() => {
		return UserSpecialSelection.current === 'none';
	}, [UserSpecialSelection, UserStateHash]);

	const IsTagAllSelected = TagSpecialSelection.current === 'all';
	const IsTagNoneSelected = TagSpecialSelection.current === 'none';

	const POST_TOTAL_COUNT = postsCached.length;
	const USER_TOTAL_COUNT = useMemo(() => {
		switch (UserSpecialSelection.current) {
			case 'all':
				return LoadedData.current?.length;
			case 'none':
				return 0;
			default:
				return userSet.current.size;
		}
	}, [LoadedData, UserStateHash, userSet.current]);

	return (
		<BookmarkGalleryControllerContext.Provider
			value={{
				postsTotalCount: POST_TOTAL_COUNT,
				usersTotalCount: USER_TOTAL_COUNT,
				loadMore,
				posts: Posts,
				isUserSelected,
				isTagSelected,
				acct,
				isBuilding,
				isRefreshing: IsLoading,
				onUserSelected,
				onTagSelected,
				onUserAllSelected,
				onUserNoneSelected,
				onTagAllSelected,
				onTagNoneSelected,
				loadedUserData: LoadedData.current,
				loadedTagData: LoadedTagData.current,
				IsUserAllSelected,
				IsUserNoneSelected,
				IsTagAllSelected,
				IsTagNoneSelected,
				userStateHash: UserStateHash,
				tagStateHash: TagStateHash,
			}}
		>
			{children}
		</BookmarkGalleryControllerContext.Provider>
	);
}

export default WithBookmarkGalleryControllerContext;
