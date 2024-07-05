import { Image } from 'expo-image';
import { MEDIA_CONTAINER_WIDTH } from './_common';
import { Fragment, memo, useEffect, useRef, useState } from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { APP_FONT } from '../../../styles/AppTheme';
import { Dialog } from '@rneui/themed';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Props = {
	url?: string;
	blurhash?: string;
};

export const AppImageComponent = memo(function Foo({ url, blurhash }: Props) {
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
});

export const AppVideoComponent = memo(function Foo({
	url,
	height,
	loop,
	type,
}: {
	url: string;
	height: number;
	loop?: boolean;
	type: string;
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
});

type AltTextDialogProps = {
	altText?: string;
};

export const AltTextDialog = memo(function Foo({
	altText,
}: AltTextDialogProps) {
	const [IsVisible, setIsVisible] = useState(false);
	return (
		<Fragment>
			<View
				style={{
					position: 'absolute',
					display: altText ? 'flex' : 'none',
					top: '100%',
					left: '0%',
					zIndex: 99,
				}}
			>
				<View style={{ position: 'relative' }}>
					<Pressable
						style={{
							position: 'absolute',
							top: -40,
							left: 8,
							backgroundColor: 'rgba(100, 100, 100, 0.87)',
							padding: 4,
							borderRadius: 8,
						}}
						onPress={() => {
							setIsVisible(true);
						}}
					>
						<FontAwesome5
							name="info-circle"
							size={24}
							color={APP_FONT.MONTSERRAT_BODY}
						/>
					</Pressable>
				</View>
			</View>
			<Dialog
				isVisible={IsVisible}
				onBackdropPress={() => {
					setIsVisible(false);
				}}
				overlayStyle={{ backgroundColor: '#383838', borderRadius: 8 }}
			>
				<View
					style={{
						display: 'flex',
						width: '100%',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between',
						marginBottom: 4,
					}}
				>
					<View>
						<Text
							style={{
								color: APP_FONT.MONTSERRAT_BODY,
								fontFamily: 'Inter-Bold',
								fontSize: 20,
							}}
						>
							Alt Text
						</Text>
					</View>

					<View style={{ padding: 8, marginRight: -8, marginTop: -12 }}>
						<MaterialCommunityIcons
							name="text-to-speech"
							size={28}
							color={APP_FONT.MONTSERRAT_BODY}
						/>
					</View>
				</View>

				<Text
					style={{
						color: APP_FONT.MONTSERRAT_BODY,
					}}
				>
					{altText}
				</Text>
			</Dialog>
		</Fragment>
	);
});

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
