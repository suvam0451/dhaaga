import { useShallow } from 'zustand/react/shallow';
import useStore from './store';

export function useAuth() {
	return useStore(useShallow((state) => state.auth));
}

export function useActiveToken() {
	return useStore((state) => {
		const { activeAccountId, tokens } = state.auth;
		if (!activeAccountId) return null;
		return tokens[activeAccountId] || null;
	});
}
