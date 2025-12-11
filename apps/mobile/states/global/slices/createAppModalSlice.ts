import { APP_KNOWN_MODAL } from '#/states/global/store';
import { RandomUtil } from '@dhaaga/bridge';
import { AppStateImmerSetObject } from '#/states/global/typings';

export function ModalStateBlockGenerator(
	set: AppStateImmerSetObject,
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
