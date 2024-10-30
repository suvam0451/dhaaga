import {
	DEFAULT_THEME_PACK_OBJECT,
	ThemePackType,
} from '../../assets/loaders/UseAppThemePackLoader';
import { AppColorSchemeType } from '../../styles/BuiltinThemes';
import { create } from 'zustand';

type AppThemePack = {
	id: string;
	name: string;
};

type State = {
	packId: string;
	colorScheme: AppColorSchemeType;
	packList: AppThemePack[];
	activePack: ThemePackType;
};

type Actions = {
	getPacks: () => AppThemePack[];
	setPack: (packId: string) => void;
};

const defaultValue: State & Actions = {
	packId: 'default',
	packList: [],
	colorScheme: undefined,
	getPacks: () => [],
	setPack: () => {},
	activePack: DEFAULT_THEME_PACK_OBJECT,
};

const useAppThemeStore = create<State & Actions>()((set) => ({
	...defaultValue,
	getPacks: () => [],
	setPack: (packId: string) => {
		set({ packId });
	},
}));

export default useAppThemeStore;
