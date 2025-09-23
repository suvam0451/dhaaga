import { StyleProp, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { useAssets } from 'expo-asset';
import { LinkingUtils } from '../../../utils/linking.utils';

type CoffeeProps = {
	containerStyle?: StyleProp<ViewStyle>;
};

export function CoffeeIconOnly({ containerStyle }: CoffeeProps) {
	const [assets, error] = useAssets([
		require('../../../assets/badges/bmac-icon.png'),
	]);
	const LOADED = !error && assets?.every((o) => o?.downloaded);

	function onTouch() {
		LinkingUtils.openCoffeeLink();
	}

	if (!assets || !LOADED) return <View />;
	return (
		<View
			style={[
				{
					borderRadius: 8,
					flexDirection: 'row',
				},
				containerStyle,
			]}
			onTouchEnd={onTouch}
		>
			{/*@ts-ignore-next-line*/}
			<Image
				source={assets[0].localUri!}
				style={{
					width: '100%',
					maxWidth: 40,
					height: 40,
					borderRadius: 8,
					opacity: 0.87,
				}}
			/>
		</View>
	);
}

function Coffee({ containerStyle }: CoffeeProps) {
	const [assets, error] = useAssets([
		require('../../../assets/badges/bmc-button.png'),
	]);

	const LOADED = !error && assets?.every((o) => o?.downloaded);

	function onTouch() {
		LinkingUtils.openCoffeeLink();
	}

	if (!assets || !LOADED) return <View></View>;
	return (
		<View
			style={[
				{
					borderRadius: 8,
					flexDirection: 'row',
				},
				containerStyle,
			]}
			onTouchEnd={onTouch}
		>
			{/*@ts-ignore-next-line*/}
			<Image
				source={assets[0].localUri!}
				style={{
					width: '100%',
					maxWidth: 172,
					height: 42,
					borderRadius: 8,
					opacity: 0.87,
				}}
			/>
		</View>
	);
}

export default Coffee;
