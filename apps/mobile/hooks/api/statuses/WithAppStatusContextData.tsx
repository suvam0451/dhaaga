import {
	AppStatusContext,
	STATUS_CONTEXT_REDUCER_ACTION,
} from './statusContextReducer';
import { createContext, Dispatch, useCallback, useContext } from 'react';
import type { PostObjectType } from '@dhaaga/bridge';

type Type = {
	data: AppStatusContext;
	dispatch: Dispatch<{ type: STATUS_CONTEXT_REDUCER_ACTION; payload: any }>;
	getChildren: (id: string) => PostObjectType[];
};

const defaultValue: Type = {
	data: {
		entrypoint: '',
		lookup: undefined,
		children: undefined,
		root: '',
	},
	dispatch: function (value: {
		type: STATUS_CONTEXT_REDUCER_ACTION;
		payload: any;
	}): void {
		throw new Error('Function not implemented.');
	},
	getChildren: function (id: string): PostObjectType[] {
		throw new Error('Function not implemented.');
	},
};

const AppStatusContextDataContext = createContext<Type>(defaultValue);

export function useAppStatusContextDataContext() {
	return useContext(AppStatusContextDataContext);
}

type Props = {
	data: AppStatusContext;
	dispatch: Dispatch<{ type: STATUS_CONTEXT_REDUCER_ACTION; payload: any }>;
	children: any;
};

function WithAppStatusContextDataContext({ children, data, dispatch }: Props) {
	/**
	 * Get the children of this status
	 * in context tree
	 */
	const getChildren = useCallback(
		(id: string) => {
			if (!id) return [];
			const list = data.children.get(id);
			if (!list) return [];

			return list
				.map((o) => data.lookup.get(o))
				.filter((o) => o !== null && o !== undefined);
		},
		[data],
	);

	return (
		<AppStatusContextDataContext.Provider
			value={{
				data,
				dispatch,
				getChildren,
			}}
		>
			{children}
		</AppStatusContextDataContext.Provider>
	);
}

export default WithAppStatusContextDataContext;
