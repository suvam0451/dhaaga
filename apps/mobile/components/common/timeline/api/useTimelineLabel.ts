import { useTimelineController } from './useTimelineController';
import { useMemo } from 'react';
import { TimelineFetchMode } from '../utils/timeline.types';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

function useTimelineLabel() {
	const { driver } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
		})),
	);

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
				return [KNOWN_SOFTWARE.PLEROMA, KNOWN_SOFTWARE.AKKOMA].includes(driver)
					? `Known Network`
					: `Federated`;
			}
			case TimelineFetchMode.SOCIAL:
				return 'Social';
			case TimelineFetchMode.BUBBLE:
				return 'Bubble Timeline';
			default: {
				return 'Unassigned';
			}
		}
	}, [timelineType, query, driver]);
}

export default useTimelineLabel;
