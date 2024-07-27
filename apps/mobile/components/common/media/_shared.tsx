import { Image } from 'expo-image';
import { MEDIA_CONTAINER_WIDTH } from './_common';
import { Fragment, memo, useEffect, useMemo, useRef, useState } from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Pressable, StyleSheet, View } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { APP_FONT } from '../../../styles/AppTheme';
import { Dialog } from '@rneui/themed';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Text } from '@rneui/themed';
// import { Audio } from 'expo-av';
import AntDesign from '@expo/vector-icons/AntDesign';

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
				opacity: 0.75,
			}}
			placeholder={{ blurhash }}
			source={{ uri: url }}
		/>
	);
});

export const AppAudioComponent = memo(function Foo({ url }: { url: string }) {
	// const [sound, setSound] = useState<Audio.Sound | null>(null);
	//
	// async function create() {
	// 	const { sound } = await Audio.Sound.createAsync(
	// 		{ uri: url },
	// 		{ shouldPlay: true, isMuted: false },
	// 	);
	// 	setSound(sound);
	// 	await sound.playAsync();
	// }

	// useEffect(() => {
	// 	return sound
	// 		? () => {
	// 				console.log('Unloading Sound');
	// 				sound.unloadAsync();
	// 			}
	// 		: undefined;
	// }, [sound]);

	return (
		<View key={101}>
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					padding: 12,
					borderRadius: 8,
					paddingHorizontal: 16,
					backgroundColor: '#3c3c3c',
				}}
			>
				<AntDesign
					// onPress={create}
					name="play"
					size={24}
					color={APP_FONT.MONTSERRAT_BODY}
				/>
				<Text style={{ color: APP_FONT.MONTSERRAT_BODY, marginLeft: 8 }}>
					Audio Not Implemented
				</Text>
			</View>
		</View>
	);
});

export const AppVideoComponent = memo(function Foo({
	url,
	height,
	loop,
}: {
	url: string;
	height: number;
	loop?: boolean;
	type: string;
}) {
	const ref = useRef(null);
	const [isPlaying, setIsPlaying] = useState(true);
	let modifiedUrl = url.replace('?sensitive=true', '');

	const player = useVideoPlayer(modifiedUrl, (player) => {
		if (loop) {
			player.loop = true;
		}
		// if (type === 'gifv') {
		// 	player.play();
		// }
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
					height,
					borderRadius: 8,
				}}
				player={player}
				allowsFullscreen
				allowsPictureInPicture
				// nativeControls={type !== 'gifv'}
			/>
		</View>
	);
});

type AltTextDialogProps = {
	altText?: string;
};

export const AltTextOverlay = memo(function Foo({
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

export const CarousalIndicatorOverlay = memo(function Foo({
	index,
	totalCount,
}: {
	index?: number;
	totalCount?: number;
}) {
	const CarousalIndicators = useMemo(() => {
		if (index === undefined || totalCount === undefined) return <View></View>;

		const retval = [];
		for (let i = 0; i < totalCount; i++) {
			retval.push(
				<View
					style={{
						height: 12,
						width: 12,
						borderRadius: 8,
						backgroundColor: 'rgba(100, 100, 100, 0.87)',
						marginHorizontal: 4,
					}}
				></View>,
			);
		}
		return (
			<View
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					// backgroundColor: 'red',
					width: '100%',
					alignItems: 'center',
				}}
			>
				{retval}
			</View>
		);
	}, [index, totalCount]);

	if (index === undefined || totalCount === undefined) return <View></View>;
	return (
		<Fragment>
			<View
				style={{
					position: 'absolute',
					left: '100%',
					top: 0,
				}}
			>
				<View
					style={{
						position: 'absolute',
						left: -48,
						backgroundColor: 'rgba(100, 100, 100, 0.87)',
						top: 8,
						padding: 4,
						paddingHorizontal: 8,
						borderRadius: 8,
					}}
				>
					<Text style={{ color: APP_FONT.MONTSERRAT_HEADER }}>
						{index + 1}/{totalCount}
					</Text>
				</View>
			</View>
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
