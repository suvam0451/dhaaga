import { createContext, useContext, useState, ReactNode } from 'react';
import { type StoreApi } from 'zustand';

/**
 * Use to wrap a component tree with zustand store
 * @param getStore
 */
export const zustandContext = <TInitial, TStore extends StoreApi<any>>(
	getStore: (initial: TInitial) => TStore,
) => {
	const Context = createContext(null as any as TStore);

	const Provider = (props: {
		children?: ReactNode;
		initialValue?: TInitial;
	}) => {
		const [store] = useState(getStore(props.initialValue));

		return <Context.Provider value={store}>{props.children}</Context.Provider>;
	};

	return {
		useContext: () => useContext(Context),
		Context,
		Provider,
	};
};
