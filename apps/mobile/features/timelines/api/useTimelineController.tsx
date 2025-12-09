import { DhaagaJsTimelineQueryOptions } from '@dhaaga/bridge';
import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { TimelineFetchMode } from '@dhaaga/core';

export type AppTimelineQuery = {
	id: string;
	label: string;
};

type Type = {
	// the type of timeline to be shown in index screen
	timelineType: TimelineFetchMode;
	setTimelineType: (x: TimelineFetchMode) => void;
	opts: DhaagaJsTimelineQueryOptions;
	setOpts: (opts: DhaagaJsTimelineQueryOptions) => void;
	query?: AppTimelineQuery;
	setQuery: (obj: AppTimelineQuery) => void;
	ShowTimelineSelection: boolean;
	setShowTimelineSelection: Dispatch<SetStateAction<boolean>>;
};

const defaultValue: Type = {
	setOpts: () => {},
	timelineType: TimelineFetchMode.IDLE,
	ShowTimelineSelection: false,
	setShowTimelineSelection: () => {},
	setTimelineType: () => {},
	opts: { limit: 5 },
	setQuery: () => {},
};

const TimelineControllerContext = createContext<Type>(defaultValue);

/**
 * Use this hook to:
 * - set the type of timeline to render
 * - set query target (setQuery, applicable for lists/tags/users/remote)
 * - set other query options
 *
 * @deprecated unused
 */
export function useTimelineController() {
	return useContext(TimelineControllerContext);
}
