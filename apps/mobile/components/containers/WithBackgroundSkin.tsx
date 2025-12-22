import { useAssets } from 'expo-asset';
import { View, ImageBackground } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { useMemo } from 'react';
import { Asset } from 'expo-asset';

let LICENSED_RESOURCES = [];
if (!['skinned', 'dev'].includes(process.env.APP_VARIANT)) {
	LICENSED_RESOURCES = [
		Asset.fromModule(require('#/assets/licensed/backdrops/christmas.jpeg')),
		Asset.fromModule(require('#/assets/licensed/backdrops/white_album.jpg')),
		Asset.fromModule(require('#/assets/licensed/backdrops/beast_within.jpg')),
		Asset.fromModule(require('#/assets/licensed/backdrops/kataware_doki.jpg')),
	];
}

function WithBackgroundSkin({ children }: any) {
	const { theme } = useAppTheme();
	const [assets, error] = useAssets(LICENSED_RESOURCES);

	const LOADED = !error && assets?.every((o) => o?.downloaded);

	const uri = useMemo(() => {
		if (!LOADED) return null;

		// lite edition or ci
		if (assets.length === 0) return null;

		switch (theme.id) {
			case 'christmas':
				return assets[0].localUri;
			case 'white_album':
			case 'white_album_2':
				return assets[1].localUri;
			case 'beast_within':
				return assets[2].localUri;
			case 'kataware_doki':
				return assets[3].localUri;
			case 'default':
				return null;
			default:
				return null;
		}
	}, [theme.id, LOADED]);

	if (!LOADED) return <View />;

	if (uri) {
		return (
			<ImageBackground source={{ uri }} style={{ flex: 1, height: '100%' }}>
				{children}
			</ImageBackground>
		);
	} else {
		return (
			<View style={{ flex: 1, backgroundColor: theme.background.a0 }}>
				{children}
			</View>
		);
	}
}

export default WithBackgroundSkin;
