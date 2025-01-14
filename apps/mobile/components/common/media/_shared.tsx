import { Image } from 'expo-image';
import { MEDIA_CONTAINER_WIDTH } from './_common';
import { Fragment, memo, useEffect, useRef, useState } from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { Dialog } from '@rneui/themed';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import useGalleryDims from '../../../hooks/app/useGalleryDims';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { AppText } from '../../lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { appVerticalIndex } from '../../../styles/dimensions';

type Props = {
	url?: string;
	blurhash?: string;
	parentContainerHeight?: number;
	parentContainerWidth?: number;
	leftMarginAdjustment?: number;
};

export const AppImageComponent = memo(function Foo({
	url,
	parentContainerHeight,
	parentContainerWidth,
}: Props) {
	/**
	 * FIXME:
	 *
	 * #1: The ImageHeight should be capped to the height of container
	 * #2: overflow: "hidden" should not be needed
	 */
	const { ImageHeight, ImageWidth, onLayoutChanged } = useGalleryDims([
		{ url },
	]);

	return (
		<View
			style={{
				height: parentContainerHeight,
				width: parentContainerWidth,
				alignItems: 'center',
				justifyContent: 'center',
				overflow: 'hidden',
				borderRadius: 8,
			}}
			onLayout={onLayoutChanged}
		>
			{/*@ts-ignore-next-line*/}
			<Image
				contentFit="fill"
				style={{
					// flex: 1,
					borderRadius: 8,
					opacity: 0.87,
					width: ImageWidth,
					height: ImageHeight,
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
			/>
		</View>
	);
});

export function AppAudioComponent({ url }: { url: string }) {
	const { theme } = useAppTheme();
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
					color={theme.secondary.a20}
				/>
				<Text style={{ color: theme.secondary.a20, marginLeft: 8 }}>
					Audio Not Implemented
				</Text>
			</View>
		</View>
	);
}

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
	let modifiedUrl = url?.replace('?sensitive=true', '');

	const player = useVideoPlayer(modifiedUrl, (player) => {
		if (loop) {
			player.loop = true;
		}
		// if (type === 'gifv') {
		// 	player.play();
		// }
	});

	useEffect(() => {
		// const subscription = player.addListener('playingChange', (isPlaying) => {
		// 	setIsPlaying(isPlaying);
		// });

		return () => {
			// subscription.remove();
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
				nativeControls={true}
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
	const { theme } = useAppTheme();
	const [IsVisible, setIsVisible] = useState(false);
	return (
		<Fragment>
			<View
				style={{
					position: 'absolute',
					display: altText ? 'flex' : 'none',
					top: '100%',
				}}
			>
				<View style={{ position: 'relative' }}>
					<Pressable
						style={{
							position: 'absolute',
							top: -40,
							left: 8,
							backgroundColor: theme.palette.bg,
							padding: 6,
							borderRadius: 8,
							opacity: 0.75,
						}}
						onPress={() => {
							setIsVisible(true);
						}}
					>
						<AppText.Medium>ALT</AppText.Medium>
					</Pressable>
				</View>
			</View>
			<Dialog
				isVisible={IsVisible}
				onBackdropPress={() => {
					setIsVisible(false);
				}}
				overlayStyle={{
					backgroundColor: theme.background.a20,
					zIndex: appVerticalIndex.dialogContent,
					borderRadius: 8,
					maxWidth: '80%',
				}}
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
					<AppText.SemiBold
						style={{
							fontSize: 20,
						}}
					>
						Alt Text
					</AppText.SemiBold>

					<View style={{ padding: 8, marginRight: -8, marginTop: -12 }}>
						<MaterialCommunityIcons
							name="text-to-speech"
							size={28}
							color={theme.secondary.a20}
						/>
					</View>
				</View>

				<AppText.Normal emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}>
					{altText}
				</AppText.Normal>
			</Dialog>
		</Fragment>
	);
});

export function CarousalIndicatorOverlay({
	index,
	total,
}: {
	index?: number;
	total?: number;
}) {
	const { theme } = useAppTheme();

	if (total < 2) return <View />;
	return (
		<View style={styles.carousalIndexContainer}>
			<View
				style={[
					styles.carousalIndexContent,
					{
						backgroundColor: theme.palette.bg,
					},
				]}
			>
				<AppText.Normal>
					{index + 1}/{total}
				</AppText.Normal>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	carousalIndexContainer: {
		position: 'absolute',
		right: 0,
		top: 8,
	},
	carousalIndexContent: {
		position: 'absolute',
		left: -48,
		opacity: 0.7,
		padding: 4,
		paddingHorizontal: 8,
		borderRadius: 8,
	},
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
