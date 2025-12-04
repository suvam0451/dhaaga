import { Image } from 'expo-image';
import { useEffect, useRef } from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import {
	useAppDialog,
	useAppTheme,
} from '#/hooks/utility/global-state-extractors';
import { AppText } from '../../lib/Text';

type Props = {
	url?: string;
	blurhash?: string;
	parentContainerHeight?: number;
	parentContainerWidth?: number;
	leftMarginAdjustment?: number;
};

export function AppImageComponent({
	url,
	parentContainerWidth,
	parentContainerHeight,
}: Props) {
	return (
		<View
			style={{
				alignItems: 'center',
				justifyContent: 'center',
				borderRadius: 8,
				width: '100%',
				flex: 1,
			}}
		>
			<Image
				source={{ uri: url }}
				style={{
					borderRadius: 8,
					height: parentContainerHeight,
					width: parentContainerWidth,
					alignItems: 'center',
					justifyContent: 'center',
					flex: 1,
				}}
			/>
		</View>
	);
}

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
					name="play-circle"
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

export function AppVideoComponent({
	url,
	containerHeight,
	containerWidth,
	loop,
}: {
	url: string;
	containerHeight: number;
	containerWidth: number;
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
		<View style={[styles.contentContainer, { height: containerHeight }]}>
			<VideoView
				ref={ref}
				style={{
					width: containerWidth,
					height: containerHeight,
					borderRadius: 8,
				}}
				player={player}
				nativeControls={true}
			/>
		</View>
	);
}

type AltTextDialogProps = {
	altText?: string;
};

export function AltTextOverlay({ altText }: AltTextDialogProps) {
	const { theme } = useAppTheme();
	const { show } = useAppDialog();

	function onClickAltText() {
		show({
			title: 'Alt Text',
			description: [altText],
			actions: [],
		});
	}
	return (
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
						top: -36,
						left: 6,
						backgroundColor: theme.palette.bg,
						padding: 6,
						borderRadius: 8,
						opacity: 0.75,
					}}
					onPress={onClickAltText}
				>
					<AppText.Medium style={{ fontSize: 13 }}>ALT</AppText.Medium>
				</Pressable>
			</View>
		</View>
	);
}

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
