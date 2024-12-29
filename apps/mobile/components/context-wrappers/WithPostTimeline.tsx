import {
	createContext,
	MutableRefObject,
	useContext,
	useEffect,
	useReducer,
	useRef,
} from 'react';
import {
	appTimelineReducer,
	appTimelineReducerDefault,
	AppTimelineReducerDispatchType,
	AppTimelineReducerStateType,
} from '../../states/reducers/timeline.reducer';
import { TimelineSessionService } from '../../services/session/timeline-session.service';
import { useAppApiClient } from '../../hooks/utility/global-state-extractors';
import WithTimelineControllerContext from '../common/timeline/api/useTimelineController';
import WithAppTimelineDataContext from '../../hooks/app/timelines/useAppTimelinePosts';
import UserPeekModal from '../modals/UserPeekModal';

/**
 * --- Context Setup ---
 */

const _StateCtx = createContext<AppTimelineReducerStateType>(null);
const _DispatchCtx = createContext<AppTimelineReducerDispatchType>(null);
const _ManagerCtx =
	createContext<MutableRefObject<TimelineSessionService>>(null);
// exports
export const useTimelineState = () => useContext(_StateCtx);
export const useTimelineDispatch = () => useContext(_DispatchCtx);
export const useTimelineManager = () => useContext(_ManagerCtx);

/**
 * --- Context Wrapper ---
 */

export function CtxWrapper({ children }) {
	const { driver, client } = useAppApiClient();
	const [state, dispatch] = useReducer(
		appTimelineReducer,
		appTimelineReducerDefault,
	);

	const manager = useRef<TimelineSessionService>(null);
	useEffect(() => {
		manager.current = new TimelineSessionService(driver, client, dispatch);
	}, [driver, client, dispatch]);

	return (
		<_StateCtx.Provider value={state}>
			<_DispatchCtx.Provider value={dispatch}>
				<_ManagerCtx.Provider value={manager}>{children}</_ManagerCtx.Provider>
			</_DispatchCtx.Provider>
		</_StateCtx.Provider>
	);
}

/**
 * makes the following hooks available
 *
 * - useTimelineState
 * - useTimelineDispatch
 * - useTimelineManager
 *
 * Makes the following modals available
 *
 * - UserPeekModal
 */
function WithPostTimelineCtx({ children }: any) {
	return (
		<WithTimelineControllerContext>
			<CtxWrapper>
				<WithAppTimelineDataContext>
					{children}
					<UserPeekModal />
				</WithAppTimelineDataContext>
			</CtxWrapper>
		</WithTimelineControllerContext>
	);
}

export default WithPostTimelineCtx;
