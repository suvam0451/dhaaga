import { createContext, memo, useContext, useReducer } from 'react';
import DiscoverTabFactory from './stack/landing/fragments/DiscoverTabFactory';
import {
	DiscoverTabDispatchType,
	DiscoverTabReducerStateType,
	discoverTabReducerReducer as reducer,
	discoverTabReducerDefault as reducerDefault,
} from '../../../states/reducers/discover-tab.reducer';

// contexts
const StateCtx = createContext<DiscoverTabReducerStateType>(null);
const DispatchCtx = createContext<DiscoverTabDispatchType>(null);
// hooks
export const useDiscoverTabState = () => useContext(StateCtx);
export const useDiscoverTabDispatch = () => useContext(DispatchCtx);
// wrapper
function Wrapper({ children }) {
	const [state, dispatch] = useReducer(reducer, reducerDefault);
	return (
		<StateCtx.Provider value={state}>
			<DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>
		</StateCtx.Provider>
	);
}

/**
 * The landing page for the
 * discover module
 */
const DiscoverLanding = memo(() => {
	return (
		<Wrapper>
			<DiscoverTabFactory />
		</Wrapper>
	);
});

export default DiscoverLanding;
