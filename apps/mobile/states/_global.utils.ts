import { AppGlobalActions, AppGlobalState } from '#/states/_global.types';
import { RandomUtil } from '@dhaaga/bridge';
import { APP_KNOWN_MODAL } from '#/states/_global';
import { WritableDraft } from 'immer';

export function ModalStateBlockGenerator(
	set: (
		nextStateOrUpdater:
			| (AppGlobalState & AppGlobalActions)
			| Partial<AppGlobalState & AppGlobalActions>
			| ((state: WritableDraft<AppGlobalState & AppGlobalActions>) => void),
		shouldReplace?: false,
	) => void,
	modalType: APP_KNOWN_MODAL,
) {
	return {
		stateId: RandomUtil.nanoId(),
		visible: false,
		hide: () => {
			set((state) => {
				state[modalType].visible = false;
			});
		},
		show: (refresh?: boolean) => {
			set((state) => {
				state[modalType].visible = true;
				if (refresh) state[modalType].stateId = RandomUtil.nanoId();
			});
		},
		refresh: () => {
			set((state) => {
				state[modalType].stateId = RandomUtil.nanoId();
			});
		},
	};
}
