import {
	GalleryTagAggregationItem,
	GalleryUserAggregationItem,
} from '../hooks/realm/useBookmarkGalleryBuilder';
import { createContext, useContext } from 'react';
import { Account } from '../entities/account.entity';

type InheritedType = {
	acct: Account;
	loadedUserData: GalleryUserAggregationItem[];
	loadedTagData: GalleryTagAggregationItem[];
	// when query is being built for first time
	isBuilding: boolean;
	// when built data is searched/filtered
	isRefreshing: boolean;
};

type Type = {} & InheritedType;

const defaultValue: Type = {
	acct: undefined,
	loadedUserData: [],
	loadedTagData: [],
	isBuilding: false,
	isRefreshing: false,
};

const BookmarkGalleryControllerContext = createContext<Type>(defaultValue);

export function useBookmarkGalleryControllerContext() {
	return useContext(BookmarkGalleryControllerContext);
}

type Props = {
	children: any;
} & InheritedType;

function WithBookmarkGalleryControllerContext({
	children,
	acct,
	isBuilding,
	loadedUserData,
	loadedTagData,
	isRefreshing,
}: Props) {
	return (
		<BookmarkGalleryControllerContext.Provider
			value={{ acct, isRefreshing, isBuilding, loadedUserData, loadedTagData }}
		>
			{children}
		</BookmarkGalleryControllerContext.Provider>
	);
}

export default WithBookmarkGalleryControllerContext;
