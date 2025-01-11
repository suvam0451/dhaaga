import {
	createContext,
	MutableRefObject,
	useContext,
	useEffect,
	useReducer,
	useRef,
} from 'react';
import {
	AppFeedTimelineReducerDispatchType,
	AppFeedTimelineReducerStateType,
	appFeedTimelineReducer,
	appFeedTimelineReducerDefault,
} from '../../states/reducers/feed-timeline.reducer';
import { useAppApiClient } from '../../hooks/utility/global-state-extractors';
import { UserTimelineSessionService } from '../../services/session/user-timeline-session.service';

/**
 * --- Context Setup ---
 */

const _StateCtx = createContext<AppFeedTimelineReducerStateType>(null);
const _DispatchCtx = createContext<AppFeedTimelineReducerDispatchType>(null);
const _ManagerCtx =
	createContext<MutableRefObject<UserTimelineSessionService>>(null);
// exports
export const useFeedTimelineState = () => useContext(_StateCtx);
export const useFeedTimelineDispatch = () => useContext(_DispatchCtx);
export const useFeedTimelineManager = () => useContext(_ManagerCtx);

/**
 * --- Context Wrapper ---
 */

export function CtxWrapper({ children }) {
	const { driver, client } = useAppApiClient();
	const [state, dispatch] = useReducer(
		appFeedTimelineReducer,
		appFeedTimelineReducerDefault,
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
 * - useFeedTimelineState
 * - useFeedTimelineDispatch
 * - useFeedTimelineManager
 *
 * Makes the following modals available
 *
 * - UserPeekModal
 */
function WithUserTimelineCtx({ children }: any) {
	return <CtxWrapper>{children}</CtxWrapper>;
}

export default WithUserTimelineCtx;
