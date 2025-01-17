import { createContext, useContext, useReducer } from 'react';
import {
	CollectionViewStateType as State,
	CollectionViewDispatchType as Dispatch,
	collectionViewReducer as reducer,
	collectionViewDefault as reducerDefault,
} from '../reducers/collection-detail.reducer';

// contexts
const StateCtx = createContext<State>(null);
const DispatchCtx = createContext<Dispatch>(null);
// hooks
export const useCollectionDetailState = () => useContext(StateCtx);
export const useCollectionDetailDispatch = () => useContext(DispatchCtx);
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
function CollectionDetailCtx({ children }: any) {
	return <CtxWrapper>{children}</CtxWrapper>;
}

export default CollectionDetailCtx;
