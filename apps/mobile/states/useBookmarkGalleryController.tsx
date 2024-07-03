import useBookmarkGalleryBuilder, {
	GalleryTagAggregationItem,
	GalleryUserAggregationItem,
} from '../hooks/realm/useBookmarkGalleryBuilder';
import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Account } from '../entities/account.entity';
import { BSON } from 'realm';
import { UUID } from 'bson';
import { ActivityPubStatus } from '../entities/activitypub-status.entity';
import { randomUUID } from 'expo-crypto';

type InheritedType = {};

type Type = {
	posts: ActivityPubStatus[];
	acct: Account;
	loadedUserData: GalleryUserAggregationItem[];
	loadedTagData: GalleryTagAggregationItem[];
	isBuilding: boolean;
	isRefreshing: boolean;

	isUserSelected: (_id: BSON.UUID) => boolean;
	isTagSelected: (_id: BSON.UUID) => boolean;

	onUserSelected: (_id: BSON.UUID) => void;
	onTagSelected: (_Id: BSON.UUID) => void;

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
} & InheritedType;

const defaultValue: Type = {
	acct: null,
	loadedUserData: [],
	loadedTagData: [],
	isUserSelected: function (_id: UUID): boolean {
		throw new Error('Function not implemented.');
	},
	isTagSelected: function (_id: UUID): boolean {
		throw new Error('Function not implemented.');
	},
	onUserSelected: function (_id: UUID): void {
		throw new Error('Function not implemented.');
	},
	onTagSelected: function (_Id: UUID): void {
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
	const [UserStateHash, setUserStateHash] = useState(randomUUID());
	const UserSpecialSelection = useRef<SpecialAction>('all');
	const TagSpecialSelection = useRef<SpecialAction>('all');

	const [Query, setQuery] = useState('');

	const [TagStateHash, setTagStateHash] = useState(randomUUID());

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

	function loadMore() {
		if (!IsPaginationEnabled.current) return;
		IsPaginationEnabled.current = false;

		setPostsToShow((PostsToShow) => PostsToShow + 10);

		setTimeout(() => {
			IsPaginationEnabled.current = true;
		}, 500);
	}

	function isUserSelected(_id: BSON.UUID) {
		switch (UserSpecialSelection.current) {
			case 'all':
				return true;
			case 'none':
				return false;
			default: {
				return userSet.current.has(_id.toString());
			}
		}
	}

	function isTagSelected(_id: BSON.UUID) {
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
	}

	function onUserAllSelected() {
		UserSpecialSelection.current = 'all';
		userSet.current.clear();
		setUserStateHash(randomUUID());
	}

	function onUserNoneSelected() {
		UserSpecialSelection.current = 'none';
		userSet.current.clear();
		setUserStateHash(randomUUID());
	}

	function onTagAllSelected() {
		TagSpecialSelection.current = 'all';
		tagSet.current.clear();
		setUserStateHash(randomUUID());
	}

	function onTagNoneSelected() {
		TagSpecialSelection.current = 'none';
		tagSet.current.clear();
		setUserStateHash(randomUUID());
	}

	function onUserSelected(_id: UUID) {
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
		setUserStateHash(randomUUID());
	}

	function onTagSelected(_id: UUID) {}

	const IsUserAllSelected = useMemo(() => {
		return UserSpecialSelection.current === 'all';
	}, [UserSpecialSelection, UserStateHash]);

	const IsUserNoneSelected = useMemo(() => {
		return UserSpecialSelection.current === 'none';
	}, [UserSpecialSelection, UserStateHash]);

	const IsTagAllSelected = TagSpecialSelection.current === 'all';
	const IsTagNoneSelected = TagSpecialSelection.current === 'none';

	return (
		<BookmarkGalleryControllerContext.Provider
			value={{
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
				loadedUserData: LoadedData,
				loadedTagData: LoadedTagData,
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
