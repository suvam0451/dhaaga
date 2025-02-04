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
			case 'image':
			case 'image/jpeg':
			case 'image/png':
			case 'image/webp':
			case 'image/gif':
			case 'image/avif': {
				const { width: _width, height: _height } =
					MediaService.calculateDimensions({
						maxW: size,
						maxH: size,
						W: width,
						H: height,
					});
				return (
					/*@ts-ignore-next-line*/
					<Image
						style={{
							width: _width,
							height: _height,
							borderRadius: 4,
							opacity: 0.87,
						}}
						source={{ uri: url }}
					/>
				);
			}
			default: {
				console.log('unknown media type', type, url, 'url');
				return <View />;
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
