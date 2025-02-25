import {
	View,
	StyleProp,
	ViewStyle,
	LayoutChangeEvent,
	Dimensions,
} from 'react-native';
import { SavedPostMediaAttachment } from '@dhaaga/db';
import { Image, useImage } from 'expo-image';
import { useState } from 'react';

type LocalMediaItemProps = {
	items: SavedPostMediaAttachment[];
	style?: StyleProp<ViewStyle>;
};

type MediaItemProps = {
	item: SavedPostMediaAttachment;
};

function MediaItemImage({ item }: MediaItemProps) {
	const [Width, setWidth] = useState(Dimensions.get('window').width);
	const img = useImage(item.previewUrl || item.url, { maxWidth: Width }, [
		Width,
	]);
	function onLayoutChanged(event: LayoutChangeEvent) {
		setWidth(event.nativeEvent.layout.width);
	}

	if (!img) return <View />;

	return (
		<View onLayout={onLayoutChanged}>
			{/*@ts-ignore-next-line*/}
			<Image
				source={img}
				style={{ height: img.height, width: img.width, borderRadius: 8 }}
			/>
		</View>
	);
}

function MediaItem({ item }: MediaItemProps) {
	switch (item.mimeType) {
		case 'image':
		case 'image/jpeg':
		case 'image/png':
		case 'image/webp':
		case 'image/gif':
		case 'image/avif': {
			return <MediaItemImage item={item} />;
		}
		default: {
			return <View />;
		}
	}
}

export function LocalMediaItem({ items }: LocalMediaItemProps) {
	if (!items || items.length === 0) return <View />;
	if (items.length === 1) return <MediaItem item={items[0]} />;
	return <View />;
}
