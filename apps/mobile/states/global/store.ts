import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import createAppDialogSlice from '#/states/global/slices/createAppDialogSlice';
import createBottomSheetSlice from '#/states/global/slices/createBottomSheetSlice';
import createHubSessionSlice from '#/states/global/slices/createHubSessionSlice';
import createUserSessionSlice from '#/states/global/slices/createUserSessionSlice';
import createAppThemingSlice from '#/states/global/slices/createAppThemingSlice';
import { AppGlobalState } from '#/states/global/typings';
import { ModalStateBlockGenerator } from '#/states/global/slices/createAppModalSlice';
import createAppSessionSlice from '#/states/global/slices/createAppSessionSlice';

export enum APP_DIALOG_SHEET_ENUM {
	DEFAULT = 'Default',
	TEXT_INPUT = 'TextInput',
}

/**
 * List of known modals
 */
export enum APP_KNOWN_MODAL {
	IMAGE_INSPECT = 'imageInspectModal',
	USER_PEEK = 'userPeekModal',
}

const useGlobalState = create<AppGlobalState>()(
	immer((set, get) => ({
		// sessions
		userSession: createUserSessionSlice(set, get),
		hubSession: createHubSessionSlice(set, get),
		appSession: createAppSessionSlice(set, get),

		// special modals
		userPeekModal: ModalStateBlockGenerator(set, APP_KNOWN_MODAL.USER_PEEK),
		imageInspectModal: ModalStateBlockGenerator(
			set,
			APP_KNOWN_MODAL.IMAGE_INSPECT,
		),
		// ui state
		bottomSheet: createBottomSheetSlice(set, get),
		dialog: createAppDialogSlice(set, get),
		appTheme: createAppThemingSlice(set, get),
	})),
);

export default useGlobalState;
