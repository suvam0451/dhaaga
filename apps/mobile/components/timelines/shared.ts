import type {
	FeedObjectType,
	PostObjectType,
	ResultPage,
	UserObjectType,
} from '@dhaaga/bridge';
import { UseQueryResult } from '@tanstack/react-query';
import { JSXElementConstructor, ReactElement, ReactNode } from 'react';

export type AppTimelineProps<
	T = PostObjectType | UserObjectType | FeedObjectType,
> = {
	label: string;
	queryResult: UseQueryResult<ResultPage<T[]>, Error>;
	/**
	 *  for certain feed types, it may be beneficial for the parent
	 * 	component to take over the initialization process
	 */
	skipTimelineInit?: boolean;
	feedSwitcherEnabled?: boolean;
	progressViewOffset?: number;

	navbarType:
		| 'none'
		| 'simple'
		| 'sticky'
		| 'custom'
		| 'unified'
		| 'inbox'
		| 'explore';
	/**
	 * The typeof header to show.
	 *
	 * - none: no header (you must have your own header)
	 * - custom: a custom header component (pass as prop)
	 * - unified: a unified header component (/feed/index page only)
	 * - 'inbox: default to 'custom' if feedSwitcherEnabled is true, otherwise 'none'
	 */
	NavBar?: () => ReactNode;
	flatListKey: string;
};

export type AppTimelineRendererProps<T = any> = AppTimelineProps<T> & {
	/**
	 * dispatch targets
	 */
	fnLoadNextPage: (data: ResultPage<T[]>) => void;
	fnReset: () => void;
	fnLoadMore: () => void;

	/**
	 * Not required to parent component
	 */
	items: T[];
	renderItem: ({
		item,
	}) => ReactElement<unknown, string | JSXElementConstructor<any>>;
};
