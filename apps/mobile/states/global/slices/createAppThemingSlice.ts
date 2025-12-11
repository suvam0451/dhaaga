import { APP_BUILT_IN_THEMES } from '#/styles/BuiltinThemes';
import {
	AppStateImmerGetObject,
	AppStateImmerSetObject,
} from '#/states/global/typings';

export type DHAAGA_SKIN_TYPE = 'winter' | null;

export type AppStateAppThemingState = {
	skin: DHAAGA_SKIN_TYPE;
	colorScheme: (typeof APP_BUILT_IN_THEMES)[0];
};

export type AppStateAppThemingActions = {
	setAppColorScheme: (key: string) => void;
	setAppSkin: (key: DHAAGA_SKIN_TYPE) => void;
};

function createAppThemingSlice(
	set: AppStateImmerSetObject,
	get: AppStateImmerGetObject,
) {
	return {
		/**
		 * ---- STATE ----
		 */

		skin: null,
		colorScheme: APP_BUILT_IN_THEMES[0],

		/**
		 * ---- ACTIONS ----
		 */

		setAppColorScheme: (key) => {
			const match = APP_BUILT_IN_THEMES.find((o) => o.id === key);
			if (match) {
				set((state) => {
					state.appTheme.colorScheme = match;
					state.appTheme.skin = null;
				});
			}
		},
		setAppSkin: (key) => {
			set((state) => {
				state.appTheme.skin = key;
			});
		},
	};
}

export default createAppThemingSlice;
