import { useAssets } from 'expo-asset';
import { View, ImageBackground } from 'react-native';
import { useAppTheme } from '#/states/global/hooks';
import { useMemo } from 'react';

function WithBackgroundSkin({ children }: any) {
	const { theme } = useAppTheme();
	const [assets, error] = useAssets([
		require('#/assets/backdrops/christmas.jpeg'),
		require('#/assets/backdrops/white_album.jpg'),
	]);
	const LOADED = !error && assets?.every((o) => o?.downloaded);

	const uri = useMemo(() => {
		if (!LOADED) return null;
		switch (theme.id) {
			case 'christmas':
				return assets[0].localUri;
			case 'white_album':
			case 'white_album_2':
				return assets[1].localUri;
			case 'default':
				return null;
			default:
				return null;
		}
	}, [theme.id, LOADED]);

	if (!LOADED) return <View />;

	if (uri) {
		return (
			<ImageBackground source={{ uri }} style={{ flex: 1 }}>
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
