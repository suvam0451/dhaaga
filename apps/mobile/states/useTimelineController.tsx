import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useState,
} from 'react';

export enum TimelineFetchMode {
	IDLE = 'Idle',
	HOME = 'Home',
	LOCAL = 'Local',
	FEDERATED = 'Federated',
	HASHTAG = 'Hashtag',
	USER = 'User',
	LIST = 'List',
	REMOTE_TIMELINE = 'Remote Timeline',
	ADD_NEW = 'Add New',
}

export type AppTimelineQuery = {
	id: string;
	label: string;
};

type Type = {
	// the type of timeline to be shown in index screen
	timelineType: TimelineFetchMode;
	setTimelineType: (x: TimelineFetchMode) => void;
	opts: {};
	query?: AppTimelineQuery;
	setQuery: (obj: AppTimelineQuery) => void;
	ShowTimelineSelection: boolean;
	setShowTimelineSelection: Dispatch<SetStateAction<boolean>>;
};

const defaultValue: Type = {
	timelineType: TimelineFetchMode.IDLE,
	ShowTimelineSelection: false,
	setShowTimelineSelection: () => {},
	setTimelineType: () => {},
	opts: {},
	setQuery: () => {},
};

const TimelineControllerContext = createContext<Type>(defaultValue);

export function useTimelineController() {
	return useContext(TimelineControllerContext);
}

type Props = {
	children: any;
};

function WithTimelineControllerContext({ children }: Props) {
	const [FetchMode, setFetchMode] = useState<TimelineFetchMode>(
		TimelineFetchMode.IDLE,
	);

	function setTimelineTypeFn(x: TimelineFetchMode) {
		setFetchMode(x);
	}

	const [ShowTimelineSelection, setShowTimelineSelection] = useState(false);

	const [Query, setQuery] = useState<AppTimelineQuery | undefined>(undefined);
	const [Opts, setOpts] = useState({});

	function setQueryOptions(input: AppTimelineQuery) {
		setQuery(input);
	}

	return (
		<TimelineControllerContext.Provider
			value={{
				timelineType: FetchMode,
				setTimelineType: setTimelineTypeFn,
				opts: Opts,
				query: Query,
				setQuery: setQueryOptions,
				ShowTimelineSelection,
				setShowTimelineSelection,
			}}
		>
			{children}
		</TimelineControllerContext.Provider>
	);
}

export default WithTimelineControllerContext;
