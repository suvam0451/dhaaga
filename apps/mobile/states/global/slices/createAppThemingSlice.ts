import { APP_BUILT_IN_THEMES } from '#/styles/BuiltinThemes';
import {
	AppStateImmerGetObject,
	AppStateImmerSetObject,
} from '#/states/global/typings';

export type DHAAGA_SKIN_TYPE = string;

export type AppStateAppThemingState = {
	skin: DHAAGA_SKIN_TYPE;
	colorScheme: (typeof APP_BUILT_IN_THEMES)[0];
};

export type AppStateAppThemingActions = {
	setAppColorScheme: (key: string) => void;
	setAppSkin: (key: DHAAGA_SKIN_TYPE) => void;
	loadSkinFromMemory: () => void;
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
			const match = APP_BUILT_IN_THEMES.find((o) => o.id === key);

			if (match) {
				get().appSession.appManager.storage.setAppSkin({
					id: key,
					useWallpaper: true,
					useIconPack: true,
					useTransparency: true,
				});
				set((state) => {
					state.appTheme.skin = key;
					state.appTheme.colorScheme = match;
				});
			} else {
				const defaultColorScheme = APP_BUILT_IN_THEMES.find(
					(o) => o.id === 'default',
				);

				set((state) => {
					state.appTheme.skin = 'default';
					state.appTheme.colorScheme = defaultColorScheme;
				});
			}
		},
		loadSkinFromMemory: () => {
			const skin = get().appSession.appManager.storage.getAppSkin();
			const match = APP_BUILT_IN_THEMES.find(
				(o) => o.id === (skin.id ?? 'default'),
			);

			if (!match) {
				get().appSession.appManager.storage.setAppSkin({
					id: 'default',
					useWallpaper: true,
					useIconPack: true,
					useTransparency: true,
				});

				const defaultColorScheme = APP_BUILT_IN_THEMES.find(
					(o) => o.id === 'default',
				);

				set((state) => {
					state.appTheme.skin = 'default';
					state.appTheme.colorScheme = defaultColorScheme;
				});
			} else {
				set((state) => {
					state.appTheme.skin = skin.id;
					state.appTheme.colorScheme = match;
				});
			}
		},
	};
}

export default createAppThemingSlice;
