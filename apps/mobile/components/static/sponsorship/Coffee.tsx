import * as Linking from 'expo-linking';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { useAssets } from 'expo-asset';

function Coffee() {
	const [assets, error] = useAssets([
		require('../../../assets/bmc-button.png'),
	]);

	const LOADED = !error && assets?.every((o) => o?.downloaded);

	function onTouch() {
		Linking.openURL('https://buymeacoffee.com/suvam');
	}

	if (!LOADED) return <View></View>;
	return (
		<View>
			<View
				style={{
					borderRadius: 8,
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center',
				}}
				onTouchEnd={onTouch}
			>
				{/*@ts-ignore-next-line*/}
				<Image
					source={assets[0].localUri}
					style={{
						width: '100%',
						maxWidth: 172,
						height: 42,
						borderRadius: 8,
						opacity: 0.87,
					}}
				/>
			</View>
		</View>
	);
}

export default Coffee;
