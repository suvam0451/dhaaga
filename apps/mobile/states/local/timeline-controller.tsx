import { TimelineFetchMode } from '../../components/common/timeline/utils/timeline.types';
import {
	DhaagaJsTimelineQueryOptions,
	KNOWN_SOFTWARE,
} from '@dhaaga/shared-abstraction-activitypub';
import { AppTimelineQuery } from '../../components/common/timeline/api/useTimelineController';
import { useAtom, createStore, atom, Provider } from 'jotai';
import { atomEffect } from 'jotai-effect';

export const timelineTypeAtom = atom<TimelineFetchMode>(TimelineFetchMode.IDLE);
export const timelineApiOpts = atom<DhaagaJsTimelineQueryOptions>({
	limit: 10,
});
export const timelineApiQuery = atom<AppTimelineQuery>({ id: '', label: '' });
export const showTimelineSelectionAtom = atom<boolean>(false);
export const timelineHeaderLabelAtom = atom('');

const headerLabelSubEffect = atomEffect((get, set) => {
	// runs on mount or whenever someAtom changes
	const value = get(timelineTypeAtom);
	const query = get(timelineApiQuery);

	switch (value) {
		case TimelineFetchMode.IDLE: {
			set(timelineHeaderLabelAtom, 'Your Social Hub');
			break;
		}
		case TimelineFetchMode.HOME: {
			set(timelineHeaderLabelAtom, 'Home');
			break;
		}
		case TimelineFetchMode.LOCAL: {
			set(timelineHeaderLabelAtom, 'Local');
			break;
		}
		case TimelineFetchMode.LIST: {
			set(timelineHeaderLabelAtom, `List: ${query?.label}`);
			break;
		}
		case TimelineFetchMode.HASHTAG: {
			set(timelineHeaderLabelAtom, `#${query?.label}`);
			break;
		}
		case TimelineFetchMode.USER: {
			set(timelineHeaderLabelAtom, `${query?.label}`);
			break;
		}
		case TimelineFetchMode.FEDERATED: {
			set(timelineHeaderLabelAtom, `Federated`);
			break;
			// return [KNOWN_SOFTWARE.PLEROMA, KNOWN_SOFTWARE.AKKOMA].includes(
			// 	domain as any,
			// )
			// 	? `Known Network`
			// 	: `Federated`;
		}
		case TimelineFetchMode.SOCIAL: {
			set(timelineHeaderLabelAtom, 'Social');
			break;
		}
		case TimelineFetchMode.BUBBLE: {
			set(timelineHeaderLabelAtom, 'Bubble Timeline');
			break;
		}
		default: {
			set(timelineHeaderLabelAtom, 'Unassigned');
			break;
		}
	}
});

const SubTree = ({ children }) => <Provider>{children}</Provider>;

export default SubTree;
