import { createContext, useContext, useState } from 'react';

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

type Type = {
	// the type of timeline to be shown in index screen
	timelineType: TimelineFetchMode;
	setTimelineType: (x: TimelineFetchMode) => void;
	opts: {
		listId?: string;
		hashtagName?: string;
		userId?: string;
	};
	setQueryOptions: (obj: any) => void;
	ShowTimelineSelection: boolean;
	setShowTimelineSelection: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultValue: Type = {
	ShowTimelineSelection: false,
	setShowTimelineSelection(
		value: ((prevState: boolean) => boolean) | boolean,
	): void {},
	timelineType: TimelineFetchMode.IDLE,
	setTimelineType: function (x: TimelineFetchMode): void {
		throw new Error('Function not implemented.');
	},
	opts: {},
	setQueryOptions: function (obj: any): void {
		throw new Error('Function not implemented.');
	},
};

const TimelineControllerContext = createContext<Type>(defaultValue);

export function useTimelineControllerContext() {
	return useContext(TimelineControllerContext);
}

type Props = {
	children: any;
};

function WithTimelineControllerContext({ children }: Props) {
	const [FetchMode, setFetchMode] = useState<TimelineFetchMode>(
		TimelineFetchMode.IDLE,
	);
	const [Options, setOptions] = useState({});
	const [ShowTimelineSelection, setShowTimelineSelection] = useState(false);

	function setQueryOptions(obj: any) {
		setOptions(obj);
	}

	function setTimelineTypeFn(x: TimelineFetchMode) {
		setFetchMode(x);
	}

	return (
		<TimelineControllerContext.Provider
			value={{
				timelineType: FetchMode,
				setTimelineType: setTimelineTypeFn,
				opts: Options,
				setQueryOptions,
				ShowTimelineSelection,
				setShowTimelineSelection,
			}}
		>
			{children}
		</TimelineControllerContext.Provider>
	);
}

export default WithTimelineControllerContext;
