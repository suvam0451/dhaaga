import { memo } from 'react';
import useReactionDimension from '../hooks/useReactionDimension';
import { Image } from 'expo-image';
import { View } from 'react-native';

const EmojiReactionImage = memo(function Foo({
	url,
	height,
	width,
}: {
	url: string;
	height?: number;
	width?: number;
}) {
	const Dims = useReactionDimension({ url, height, width });

	return (
		<View
			style={{
				height: Dims.H,
				width: Dims.W,
			}}
		>
			{/*	 @ts-ignore-next-line*/}
			<Image
				source={{
					uri: url,
					isAnimated: true,
				}}
				style={{
					height: Dims.H,
					width: Dims.W,
					opacity: 0.87,
				}}
			/>
		</View>
	);
});

export default EmojiReactionImage;
