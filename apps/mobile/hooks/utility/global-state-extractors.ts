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

export function useAppAcct() {
	return useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
		})),
	);
}

export function useAppApiClient() {
	return useGlobalState(
		useShallow((o) => ({
			client: o.router,
			driver: o.driver,
			server: o.acct?.server,
		})),
	);
}

export function useAppDb() {
	return useGlobalState(
		useShallow((o) => ({
			db: o.db,
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

export function useAppPublishers() {
	return useGlobalState(
		useShallow((o) => ({
			postPub: o.publishers.postPub,
			userPub: o.publishers.userPub,
			appSub: o.publishers.appSub,
		})),
	);
}

export function useAppBottomSheet_Improved() {
	return useGlobalState(
		useShallow((o) => ({
			type: o.bottomSheet.type,
			hide: o.bottomSheet.hide,
			show: o.bottomSheet.show,
			stateId: o.bottomSheet.stateId,
			refresh: o.bottomSheet.refresh,
			visible: o.bottomSheet.visible,
			endSessionSeed: o.bottomSheet.endSessionSeed,
			broadcastEndSession: o.bottomSheet.broadcastEndSession,
			ctx: o.bottomSheet.ctx,
			setCtx: o.bottomSheet.setCtx,
		})),
	);
}

export function useAppDialog() {
	return useGlobalState(
		useShallow((o) => ({
			type: o.dialog.type,
			visible: o.dialog.visible,
			refresh: o.dialog.refresh,
			stateId: o.dialog.stateId,
			state: o.dialog.state,
			show: o.dialog.show,
			hide: o.dialog.hide,
			textSubmitCallback: o.dialog.textSubmitCallback,
			textSeed: o.dialog.textSeed,
		})),
	);
}

export function useAppBottomSheet_TimelineReference() {
	return useGlobalState(
		useShallow((o) => ({
			draft: o.bottomSheet.timeline.draftState,
			dispatch: o.bottomSheet.timeline.dispatch,
			attach: o.bottomSheet.timeline.attach,
			manager: o.bottomSheet.timeline.manager,
		})),
	);
}
