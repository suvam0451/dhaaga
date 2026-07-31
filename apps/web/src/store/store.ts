import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import createAuthSlice from './slices/createAuthSlice';
import { RootState } from './typings';

const useStore = create<RootState>()(
	persist(
		immer((set, get) => ({
			auth: createAuthSlice(set, get),
		})),
		{
			name: 'dhaaga-storage',
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				auth: {
					tokens: state.auth.tokens,
					activeAccountId: state.auth.activeAccountId,
				},
			}),
			merge: (persistedState, currentState) => {
				const merged = { ...currentState };
				if (persistedState && typeof persistedState === 'object') {
					const p = persistedState as any;
					if (p.auth) {
						merged.auth = {
							...merged.auth,
							...p.auth,
						};
					}
				}
				return merged;
			},
		},
	),
);

export default useStore;
