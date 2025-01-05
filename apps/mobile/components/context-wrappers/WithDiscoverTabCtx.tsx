import { createContext, useContext, useReducer } from 'react';
import {
	DiscoverTabReducerStateType as State,
	DiscoverTabDispatchType as DispatchType,
	discoverTabReducer as reducer,
	discoverTabReducerDefault as reducerDefault,
} from '../../states/reducers/discover-tab.reducer';

// contexts
const StateCtx = createContext<State>(null);
const DispatchCtx = createContext<DispatchType>(null);
// hooks
export const useDiscoverTabState = () => useContext(StateCtx);
export const useDiscoverTabDispatch = () => useContext(DispatchCtx);
// wrapper
function CtxWrapper({ children }) {
	const [state, dispatch] = useReducer(reducer, reducerDefault);
	return (
		<StateCtx.Provider value={state}>
			<DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>
		</StateCtx.Provider>
	);
}

/**
 * makes the following hooks available
 *
 * - useDiscoverTabState
 * - useDiscoverTabDispatch
 *
 * Makes the following widgets available
 *
 * - UserPeekModal
 */
function WithDiscoverTabCtx({ children }: any) {
	return <CtxWrapper>{children}</CtxWrapper>;
}

export default WithDiscoverTabCtx;
