import { useImageAutoHeight } from '../../../hooks/app/useImageDims';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';

type Props = {
	url: string;
	onPress: () => void;
	onLongPress: () => void;
};

function MediaThumbView({ url, onPress, onLongPress }: Props) {
	const Data = useImageAutoHeight(url);

	if (!Data.resolved) return <View />;

	return (
		<Pressable
			style={{ marginRight: 8 }}
			onPress={onPress}
			onLongPress={onLongPress}
		>
			{/*@ts-ignore-next-line*/}
			<Image
				contentFit="fill"
				style={{
					// flex: 1,
					borderRadius: 8,
					opacity: 1,
					width: Data.width,
					height: Data.height,
					alignItems: 'center',
					justifyContent: 'center',
				}}
				source={{
					uri: url,
				}}
				transition={{
					effect: 'flip-from-right',
					duration: 120,
					timing: 'ease-in',
				}}
				onError={() => {}}
			/>
		</Pressable>
	);
}

export default MediaThumbView;
