import { useAppTheme } from '#/states/global/hooks';
import { useAssets } from 'expo-asset';
import { View } from 'react-native';
import { AppText } from '#/components/lib/Text';
import ErrorPageBuilder from '#/ui/ErrorPageBuilder';
import BearLoading from '#/components/svgs/BearLoading';
import { Image } from 'expo-image';

function SessionLoadingScreen() {
	const [assets, error] = useAssets([require('#/assets/dhaaga/icon.png')]);
	const { theme } = useAppTheme();

	if (error || !assets || assets.length < 1)
		return (
			<View style={{ height: '100%', backgroundColor: theme.palette.bg }} />
		);

	return (
		<View style={{ height: '100%', backgroundColor: theme.palette.bg }}>
			<AppText.SemiBold
				style={{ textAlign: 'center', marginTop: 24, fontSize: 32 }}
			>
				Dhaaga
			</AppText.SemiBold>
			<Image
				source={{ uri: assets[0].localUri! }}
				style={[
					{
						width: 84,
						height: 84,
						marginHorizontal: 'auto',
						borderRadius: 16,
						zIndex: 2,
						marginTop: 24,
					},
				]}
			/>
			<View style={{ marginTop: 24 }}>
				<ErrorPageBuilder
					stickerArt={<BearLoading />}
					errorMessage={'Loading...'}
					errorDescription={'Please give me some time to set things up!'}
				/>
			</View>
		</View>
	);
}

export default SessionLoadingScreen;
