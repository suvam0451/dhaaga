// store/useCounterStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type APPLICATION_TAB = 'home' | 'guides' | 'discover' | 'settings';

type ApplicationState = {
	count: number;
	activeTab: APPLICATION_TAB;
	increment: () => void;
	decrement: () => void;
};

export const useApplicationStore = create<ApplicationState>()(
	immer((set) => ({
		count: 0,
		activeTab: 'home',
		increment: () => set((state) => ({ count: state.count + 1 })),
		decrement: () => set((state) => ({ count: state.count - 1 })),
	})),
);
