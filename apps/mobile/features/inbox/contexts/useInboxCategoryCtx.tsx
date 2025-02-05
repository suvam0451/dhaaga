import { createContext, useContext, useReducer } from 'react';
import {
	inboxCategoryDispatchType as DispatchType,
	inboxCategoryReducerStateType as State,
	inboxCategoryReducer as reducer,
	inboxCategoryReducerDefault as Default,
} from '../reducers/inbox-category.reducer';

const StateCtx = createContext<State>(null);
const DispatchCtx = createContext<DispatchType>(null);

export const useInboxCategoryState = () => useContext(StateCtx);
export const useInboxCategoryDispatch = () => useContext(DispatchCtx);

function WithInboxCategoryCtx({ children }) {
	const [state, dispatch] = useReducer(reducer, Default);
	return (
		<StateCtx.Provider value={state}>
			<DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>
		</StateCtx.Provider>
	);
}

export default WithInboxCategoryCtx;
