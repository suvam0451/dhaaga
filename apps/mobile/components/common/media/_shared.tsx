import { Image } from 'expo-image';
import { MEDIA_CONTAINER_WIDTH } from './_common';
import { useEffect, useRef, useState } from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View } from 'react-native';

type Props = {
	url?: string;
	blurhash?: string;
};

export function AppImageComponent({ url, blurhash }: Props) {
	return (
		// @ts-ignore
		<Image
			style={{
				flex: 1,
				width: MEDIA_CONTAINER_WIDTH,
				borderRadius: 16,
			}}
			placeholder={{ blurhash }}
			source={{ uri: url }}
		/>
	);
}

export function AppVideoComponent({
	url,
	height,
	loop,
}: {
	url: string;
	height: number;
	loop?: boolean;
}) {
	const ref = useRef(null);
	const [isPlaying, setIsPlaying] = useState(true);
	const player = useVideoPlayer(url, (player) => {
		if (loop) {
			player.loop = true;
		}
	});

	useEffect(() => {
		const subscription = player.addListener('playingChange', (isPlaying) => {
			setIsPlaying(isPlaying);
		});

		return () => {
			subscription.remove();
		};
	}, [player]);

	return (
		<View style={[styles.contentContainer, { height }]}>
			<VideoView
				ref={ref}
				style={{
					width: MEDIA_CONTAINER_WIDTH,
					height: height,
					borderRadius: 8,
				}}
				player={player}
				allowsFullscreen
				allowsPictureInPicture
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 8,
	},
	video: {
		width: 350,
		height: 500,
	},
	controlsContainer: {
		padding: 10,
	},
});
