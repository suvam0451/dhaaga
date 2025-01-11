import { StatusInterface } from '@dhaaga/bridge';
import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { AppPostObject } from '../../../types/app-post.types';

type Type = {
	data: AppPostObject[];
	addPosts: (items: StatusInterface[]) => void;
	clear: () => void;
	/**
	 * Interaction Actions
	 */
	toggleBookmark: (
		key: string,
		dispatch: Dispatch<SetStateAction<boolean>>,
	) => void;
	toggleLike: (
		key: string,
		dispatch: Dispatch<SetStateAction<boolean>>,
	) => void;
	explain: (
		key: string,
		ctx: string[],
		dispatch: Dispatch<SetStateAction<boolean>>,
	) => void;
	boost: (key: string, dispatch: Dispatch<SetStateAction<boolean>>) => void;
	getBookmarkState: (
		key: string,
		dispatch: Dispatch<SetStateAction<boolean>>,
	) => void;
	count: number;
};

const defaultValue: Type = {
	data: [],
	addPosts: () => {},
	clear: () => {},
	getBookmarkState: () => {},
	toggleBookmark: () => {},
	toggleLike: () => {},
	explain: () => {},
	boost: () => {},
	count: 0,
};

const AppTimelineDataContext = createContext<Type>(defaultValue);

/**
 * Perform operations on a list
 * of status objects
 *
 * e.g. - like, share, translate
 *
 * @deprecated
 */
export function useAppTimelinePosts() {
	return useContext(AppTimelineDataContext);
}

type Props = {
	children: any;
};

/**
 *	@deprecated
 */
function WithAppTimelineDataContext({ children }: Props) {
	return (
		<AppTimelineDataContext.Provider value={{}}>
			{children}
		</AppTimelineDataContext.Provider>
	);
}

export default WithAppTimelineDataContext;
