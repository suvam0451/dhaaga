import { createStore, useStore } from 'zustand';
import { zustandContext } from '../../utils/zustand-context';

type State = {
	maxId: string | null;
	nextMaxId: string | null;
};

type Actions = {
	next: () => void;
	setNextMaxId: (id: string) => void;
	clear: () => void;
};

const defaultState = {
	maxId: null,
	nextMaxId: null,
};

type Foo = State & { actions: Actions };

const store = (initProps?: Partial<State>) => {
	return createStore<Foo>()((set) => ({
		...defaultState,
		...initProps,
		actions: {
			next: () => set((state) => ({ maxId: state.nextMaxId })),
			setNextMaxId: (id) => set({ nextMaxId: id }),
			clear: () => set(defaultState),
		},
	}));
};

const { Provider, useContext } = zustandContext(store);

export function usePagination() {
	return useStore(useContext());
}
export function usePaginationActions() {
	return useStore(useContext(), (o) => o.actions);
}

export const AppPaginationContext = Provider;
