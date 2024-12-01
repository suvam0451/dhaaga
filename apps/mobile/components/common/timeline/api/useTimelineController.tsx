import { DhaagaJsTimelineQueryOptions } from '@dhaaga/shared-abstraction-activitypub';
import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useState,
} from 'react';
import { TimelineFetchMode } from '../utils/timeline.types';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

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
 */
export function useTimelineController() {
	return useContext(TimelineControllerContext);
}

type Props = {
	children: any;
};

function WithTimelineControllerContext({ children }: Props) {
	const { get, set } = useGlobalState(
		useShallow((o) => ({
			get: o.homepageType,
			set: o.setHomepageType,
		})),
	);

	function setTimelineTypeFn(x: TimelineFetchMode) {
		set(x);
	}

	const [ShowTimelineSelection, setShowTimelineSelection] = useState(false);

	const [Query, setQuery] = useState<AppTimelineQuery | undefined>(undefined);
	const [Opts, setOpts] = useState({ limit: 5 });

	function setQueryOptions(input: DhaagaJsTimelineQueryOptions) {
		setOpts(input);
	}

	function setQueryParams(input: AppTimelineQuery) {
		setQuery(input);
	}

	return (
		<TimelineControllerContext.Provider
			value={{
				timelineType: get,
				setTimelineType: setTimelineTypeFn,
				opts: Opts,
				setOpts: setQueryOptions,
				query: Query,
				setQuery: setQueryParams,
				ShowTimelineSelection,
				setShowTimelineSelection,
			}}
		>
			{children}
		</TimelineControllerContext.Provider>
	);
}

export default WithTimelineControllerContext;
