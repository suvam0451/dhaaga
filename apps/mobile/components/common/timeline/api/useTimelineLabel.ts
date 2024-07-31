import { useTimelineController } from './useTimelineController';
import { useMemo } from 'react';
import { TimelineFetchMode } from '../utils/timeline.types';

function useTimelineLabel() {
	const { timelineType, query } = useTimelineController();
	return useMemo(() => {
		switch (timelineType) {
			case TimelineFetchMode.IDLE: {
				return 'Your Social Hub';
			}
			case TimelineFetchMode.HOME: {
				return 'Home';
			}
			case TimelineFetchMode.LOCAL: {
				return 'Local';
			}
			case TimelineFetchMode.LIST: {
				return `List: ${query?.label}`;
			}
			case TimelineFetchMode.HASHTAG: {
				return `#${query?.label}`;
			}
			case TimelineFetchMode.USER: {
				return `${query?.label}`;
			}
			case TimelineFetchMode.FEDERATED: {
				return `Federated`;
			}
			case TimelineFetchMode.SOCIAL:
				return 'Social';
			case TimelineFetchMode.BUBBLE:
				return 'Bubble';
			default: {
				return 'Unassigned';
			}
		}
	}, [timelineType, query]);
}

export default useTimelineLabel;
