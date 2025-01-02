import {
	createContext,
	MutableRefObject,
	useContext,
	useEffect,
	useReducer,
	useRef,
} from 'react';

/**
 * --- Context Setup ---
 */
import { UserTimelineSessionService } from '../../services/session/user-timeline-session.service';
import {
	appUserTimelineReducer,
	appUserTimelineReducerDefault,
	AppUserTimelineReducerDispatchType,
	AppUserTimelineReducerStateType,
} from '../../states/reducers/user-timeline.reducer';
import { useAppApiClient } from '../../hooks/utility/global-state-extractors';
import WithTimelineControllerContext from '../common/timeline/api/useTimelineController';
import WithAppTimelineDataContext from '../../hooks/app/timelines/useAppTimelinePosts';
import UserPeekModal from '../modals/UserPeekModal';

const _StateCtx = createContext<AppUserTimelineReducerStateType>(null);
const _DispatchCtx = createContext<AppUserTimelineReducerDispatchType>(null);
const _ManagerCtx =
	createContext<MutableRefObject<UserTimelineSessionService>>(null);
// exports
export const useUserTimelineState = () => useContext(_StateCtx);
export const useUserTimelineDispatch = () => useContext(_DispatchCtx);
export const useUserTimelineManager = () => useContext(_ManagerCtx);

/**
 * --- Context Wrapper ---
 */

export function CtxWrapper({ children }) {
	const { driver, client } = useAppApiClient();
	const [state, dispatch] = useReducer(
		appUserTimelineReducer,
		appUserTimelineReducerDefault,
	);

	const manager = useRef<UserTimelineSessionService>(null);
	useEffect(() => {
		manager.current = new UserTimelineSessionService(driver, client, dispatch);
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
 * - useUserTimelineState
 * - useUserTimelineDispatch
 * - useUserTimelineManager
 *
 * Makes the following modals available
 *
 * - UserPeekModal
 */
function WithUserTimelineCtx({ children }: any) {
	return (
		<WithTimelineControllerContext>
			<CtxWrapper>
				<WithAppTimelineDataContext>{children}</WithAppTimelineDataContext>
			</CtxWrapper>
		</WithTimelineControllerContext>
	);
}

export default WithUserTimelineCtx;
