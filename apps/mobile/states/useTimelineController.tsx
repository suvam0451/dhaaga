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
	// the type of timeline to be shown in home screen
	timelineType: TimelineFetchMode;
	setTimelineType: (x: TimelineFetchMode) => void;
};

const defaultValue: Type = {
	timelineType: TimelineFetchMode.IDLE,
	setTimelineType: function (x: TimelineFetchMode): void {
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

	function setTimelineTypeFn(x: TimelineFetchMode) {
		setFetchMode(x);
	}

	return (
		<TimelineControllerContext.Provider
			value={{
				timelineType: FetchMode,
				setTimelineType: setTimelineTypeFn,
			}}
		>
			{children}
		</TimelineControllerContext.Provider>
	);
}

export default WithTimelineControllerContext;
