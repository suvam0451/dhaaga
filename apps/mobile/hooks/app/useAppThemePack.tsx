import { createContext, useContext, useState } from 'react';
import useAppThemePackLoader, {
	DEFAULT_THEME_PACK_OBJECT,
	ThemePackType,
} from '../../assets/loaders/UseAppThemePackLoader';
import { AppColorSchemeType } from '../../styles/BuiltinThemes';

type AppThemePack = {
	id: string;
	name: string;
};

type Type = {
	packId: string;
	colorScheme: AppColorSchemeType;
	packList: AppThemePack[];
	getPacks: () => AppThemePack[];
	setPack: (packId: string) => void;
	activePack: ThemePackType;
};

const defaultValue: Type = {
	packId: 'default',
	packList: [],
	colorScheme: undefined,
	getPacks: () => [],
	setPack: () => {},
	activePack: DEFAULT_THEME_PACK_OBJECT,
};

const AppThemePackContext = createContext<Type>(defaultValue);

/**
 * Make sure to check that the assets are loaded
 * with a null check
 *
 * This thing fails without an error, dafuq?
 */
export function useAppTheme() {
	return useContext(AppThemePackContext);
}

type Props = {
	children: any;
};

function WithAppThemePackContext({ children }: Props) {
	const [ColorSchemeId, setColorSchemeId] = useState('default');
	const { ActivePack, ActiveColorScheme } =
		useAppThemePackLoader(ColorSchemeId);

	function setPack(input: string) {
		setColorSchemeId(input);
	}

	return (
		<AppThemePackContext.Provider
			value={{
				packId: 'default',
				packList: [],
				getPacks: () => [],
				setPack,
				activePack: ActivePack,
				colorScheme: ActiveColorScheme,
			}}
		>
			{children}
		</AppThemePackContext.Provider>
	);
}

export default WithAppThemePackContext;
