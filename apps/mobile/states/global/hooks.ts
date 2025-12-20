import { useShallow } from 'zustand/react/shallow';
import useGlobalState, { APP_KNOWN_MODAL } from '#/states/global/store';

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

export function useActiveUserSession() {
	return useGlobalState(
		useShallow((o) => ({
			acct: o.userSession.acct,
			acctManager: o.userSession.acctManager,
			me: o.userSession.me,
		})),
	);
}

export function useSessionManagement() {
	return useGlobalState(
		useShallow((o) => ({
			restoreSession: o.userSession.restoreSession,
			appInit: o.appSession.appInit,
		})),
	);
}

export function useActiveProfile() {
	return useGlobalState(
		useShallow((o) => ({
			profile: o.userSession.profile,
		})),
	);
}

export function useAppApiClient() {
	return useGlobalState(
		useShallow((o) => ({
			client: o.userSession.client!,
			driver: o.userSession.driver,
			server: o.userSession.acct?.server,
		})),
	);
}

export function useAppDb() {
	return useGlobalState(
		useShallow((o) => ({
			db: o.appSession.db!,
		})),
	);
}

export function useAppManager() {
	return useGlobalState(
		useShallow((o) => ({
			appManager: o.appSession.appManager,
			loadAccount: o.appSession.loadAccount,
		})),
	);
}

export function useAccountManager() {
	return useGlobalState(
		useShallow((o) => ({
			acctManager: o.userSession.acctManager,
		})),
	);
}

export function useProfileManager() {
	return useGlobalState(
		useShallow((o) => ({
			profileManager: o.userSession.profileManager,
		})),
	);
}

export function useAppTheme() {
	return useGlobalState(
		useShallow((o) => ({
			theme: o.appTheme.colorScheme,
			setTheme: o.appTheme.setAppColorScheme,
			skin: o.appTheme.skin,
			setSkin: o.appTheme.setAppSkin,
			loadSkinFromMemory: o.appTheme.loadSkinFromMemory,
		})),
	);
}

export function useAppActiveSession() {
	return useGlobalState(
		useShallow((o) => ({
			session: o.userSession,
		})),
	);
}

export function useAppGlobalStateActions() {
	return useGlobalState(
		useShallow((o) => ({
			restoreSession: o.userSession.restoreSession,
			appInit: o.appSession.appInit,
		})),
	);
}

export function useHub() {
	return useGlobalState(
		useShallow((o) => ({
			profiles: o.hubSession.profiles,
			loadAccounts: o.hubSession.refresh,
			pageIndex: o.hubSession.pageIndex,
			loadNext: o.hubSession.loadNext,
			loadPrev: o.hubSession.loadPrev,
			selectProfile: o.hubSession.selectProfile,
		})),
	);
}

export function useAppPublishers() {
	return useGlobalState(
		useShallow((o) => ({
			postEventBus: o.userSession.postEventBus,
			userEventBus: o.userSession.userEventBug,
			feedEventBus: o.userSession.feedEventBus,
			appEventBus: o.appSession.appEventBus,
		})),
	);
}

export function useImageInspect() {
	return useGlobalState(
		useShallow((o) => ({
			showInspector: o.imageInspectModal.show,
			appSession: o.appSession,
		})),
	);
}

export function useAppBottomSheet() {
	return useGlobalState(
		useShallow((o) => ({
			type: o.bottomSheet.type,
			hide: o.bottomSheet.hide,
			show: o.bottomSheet.show,
			stateId: o.bottomSheet.stateId,
			refresh: o.bottomSheet.reset,
			visible: o.bottomSheet.visible,
			ctx: o.bottomSheet.context,
			setCtx: o.bottomSheet.setContext,
			callback: o.bottomSheet.callback,
		})),
	);
}

export function useAppDialog() {
	return useGlobalState(
		useShallow((o) => ({
			visible: o.dialog.visible,
			refresh: o.dialog.reset,
			stateId: o.dialog.stateId,
			state: o.dialog.state,
			title: o.dialog.title,
			description: o.dialog.description,
			actions: o.dialog.actions,
			show: o.dialog.show,
			hide: o.dialog.hide,
			submit: o.dialog.submit,
			setState: o.dialog.setState,
		})),
	);
}
