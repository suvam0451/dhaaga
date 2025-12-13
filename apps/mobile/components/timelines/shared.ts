import type {
	PostObjectType,
	ResultPage,
	UserObjectType,
} from '@dhaaga/bridge';
import { UseQueryResult } from '@tanstack/react-query';
import { JSXElementConstructor, ReactElement } from 'react';

export type AppTimelineProps<T = PostObjectType | UserObjectType> = {
	label: string;
	queryResult: UseQueryResult<ResultPage<T[]>, Error>;
	/**
	 *  for certain feed types, it may be beneficial for the parent
	 * 	component to take over the initialization process
	 */
	skipTimelineInit?: boolean;
	feedSwitcherEnabled?: boolean;
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
