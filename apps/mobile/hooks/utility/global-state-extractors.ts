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

export function useProfileManager() {
	return useGlobalState(
		useShallow((o) => ({
			profileManager: o.profileSessionManager,
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

export function useAppBottomSheet_Improved() {
	return useGlobalState(
		useShallow((o) => ({
			hide: o.bottomSheet.hide,
			show: o.bottomSheet.show,
			stateId: o.bottomSheet.stateId,
			refresh: o.bottomSheet.refresh,
			visible: o.bottomSheet.visible,
		})),
	);
}
