import useGlobalState, { APP_KNOWN_MODAL } from '../../states/_global';
import { useShallow } from 'zustand/react/shallow';

/**
 * key extractor for the corresponding modal
 * @param modalType type of modal
 */
export function useAppModalState(modalType: APP_KNOWN_MODAL) {
	return useGlobalState(
		useShallow((o) => ({
			stateId: o[modalType].stateId,
			visible: o[modalType].visible,
			show: o[modalType].show,
			hide: o[modalType].hide,
			refresh: o[modalType].refresh,
		})),
	);
}

export function useAppManager() {
	return useGlobalState(
		useShallow((o) => ({
			appManager: o.appSession,
		})),
	);
}

export function useAppTheme() {
	return useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);
}
