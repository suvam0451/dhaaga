import { PostObjectType, ResultPage, UserObjectType } from '@dhaaga/bridge';
import { DefinedUseQueryResult } from '@tanstack/react-query';

export type SimpleTimelineProps<T = PostObjectType | UserObjectType> = {
	timelineLabel: string;
	queryResult: DefinedUseQueryResult<ResultPage<T>, Error>;
	postProcessingFn?: (input: T[]) => T[];
	/**
	 *  for certain feed types, it may be beneficial for the parent
	 * 	component to take over the initialization process
	 */
	skipTimelineInit?: boolean;
};
