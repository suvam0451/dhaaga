import { useMemo } from 'react';
import { Image } from 'expo-image';
import { View } from 'react-native';
import MediaService from '../../../services/media.service';

type MediaThumbnailProps = {
	url: string;
	type: string;
	size: number;
	height?: number;
	width?: number;
	selected?: boolean;
};

function MediaThumbnail({
	url,
	type,
	size,
	width,
	height,
}: MediaThumbnailProps) {
	const Component = useMemo(() => {
		switch (type) {
			case 'image': {
				const { width: _width, height: _height } =
					MediaService.calculateDimensions({
						maxW: size,
						maxH: size,
						W: width,
						H: height,
					});
				return (
					<View
						style={{
							width: _width,
							height: _height,
						}}
					>
						{/*@ts-ignore-next-line*/}
						<Image
							style={{
								flex: 1,
								width: _width,
								height: _height,
								borderRadius: 4,
								opacity: 0.75,
							}}
							// placeholder={{ blurhash }}
							source={{ uri: url }}
						/>
					</View>
				);
			}
			default: {
				console.log('unknown media type', type, url, 'url');
				return <View></View>;
			}
		}
	}, []);

	return (
		<View
			style={{
				width: size,
				height: size,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{Component}
		</View>
	);
}

export default MediaThumbnail;
