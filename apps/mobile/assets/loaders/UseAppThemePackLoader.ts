import { Asset } from 'expo-asset';
import { useEffect, useState } from 'react';
import {
	APP_BUILT_IN_THEMES,
	APP_DEFAULT_COLOR_SCHEME,
} from '../../styles/BuiltinThemes';
import { AppColorSchemeType } from '../../utils/theming.util';

export type ThemePackType = {
	valid: boolean;
	bookmarkInactive: Asset | null;
	bookmarkActive1: Asset | null;
	bookmarkActive2: Asset | null;
	homeLantern: Asset | null;
	homeBanner: Asset | null;
	homeAssistant: Asset | null;
	composerDecoratorInside: Asset | null;
	composerDecoratorOutside: Asset | null;
};

export const DEFAULT_THEME_PACK_OBJECT: ThemePackType = {
	valid: false,
	bookmarkInactive: null,
	bookmarkActive1: null,
	bookmarkActive2: null,
	homeLantern: null,
	homeBanner: null,
	homeAssistant: null,
	composerDecoratorInside: null,
	composerDecoratorOutside: null,
};

/**
 *	NOTE: not shipping icon theming due
 *	to cost and app size implications
 */
function useAppThemePackLoader(packId: string) {
	const [ActivePack, setActivePack] = useState<ThemePackType>(
		DEFAULT_THEME_PACK_OBJECT,
	);
	const [ActiveColorScheme, setActiveColorScheme] =
		useState<AppColorSchemeType>(APP_DEFAULT_COLOR_SCHEME);

	// const [SakuraAssetPack, SakuraAssetPackError] = useAssets([
	// 	require('../licensed/packs/sakura/bookmark/active1.png'),
	// 	require('../licensed/packs/sakura/bookmark/active2.png'),
	// 	require('../licensed/packs/sakura/bookmark/inactive.png'),
	// 	require('../licensed/packs/sakura/home/banner.png'),
	// 	require('../licensed/packs/sakura/home/lantern2.png'),
	// 	require('../licensed/packs/sakura/home/assistant.png'),
	// 	require('../licensed/packs/sakura/composer/decorator_inset.png'),
	// ]);

	// const [UsagiThemePackAssets, UsagiThemePackError] = useAssets([
	// 	require('../licensed/packs/usagi/bookmark/active1.png'),
	// 	require('../licensed/packs/usagi/bookmark/inactive.png'),
	// ]);

	useEffect(() => {
		console.log(packId);
		const match = APP_BUILT_IN_THEMES.find((o) => o.id === packId);
		if (packId === 'default') {
			setActiveColorScheme(APP_DEFAULT_COLOR_SCHEME);
			setActivePack(DEFAULT_THEME_PACK_OBJECT);
		}
		if (match) {
			setActiveColorScheme(match);
		}
	}, [packId]);

	useEffect(() => {
		setActivePack(DEFAULT_THEME_PACK_OBJECT);
	}, []);

	// useEffect(() => {
	// 	if (SakuraAssetPack === undefined) return;
	// 	if (SakuraAssetPackError) {
	// 		setActivePack(DEFAULT_THEME_PACK_OBJECT);
	// 		return;
	// 	}
	//
	// 	setActivePack({
	// 		valid: true,
	// 		bookmarkInactive: SakuraAssetPack[2],
	// 		bookmarkActive1: SakuraAssetPack[0],
	// 		bookmarkActive2: SakuraAssetPack[1],
	// 		homeBanner: SakuraAssetPack[3],
	// 		homeLantern: SakuraAssetPack[4],
	// 		homeAssistant: SakuraAssetPack[5],
	// 		composerDecoratorInside: SakuraAssetPack[6],
	// 		composerDecoratorOutside: null,
	// 	});
	// }, [SakuraAssetPack, SakuraAssetPack]);

	return { ActivePack, ActiveColorScheme };
}

export default useAppThemePackLoader;
