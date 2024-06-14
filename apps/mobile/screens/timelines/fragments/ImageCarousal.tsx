import { Dimensions, View, Text, Pressable, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useEffect, useMemo, useRef, useState } from 'react';
import React from 'react';
import { MediaAttachmentInterface } from '@dhaaga/shared-abstraction-activitypub/src';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { APP_FONT } from '../../../styles/AppTheme';
import { Button, Dialog } from '@rneui/themed';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import MediaService from '../../../services/media.service';
import { useVideoPlayer, VideoView } from 'expo-video';

type ImageCarousalProps = {
	attachments: MediaAttachmentInterface[];
};

const MEDIA_CONTAINER_MAX_HEIGHT = 540;
const MEDIA_CONTAINER_WIDTH = Dimensions.get('window').width - 20;

const MARGIN_TOP = 8;

function TimelineVideoRendered({
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
		// player.play();
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

function TimelineMediaRendered({
	attachment,
	CalculatedHeight,
	altText,
}: {
	attachment: MediaAttachmentInterface;
	CalculatedHeight: number;
	altText?: string;
}) {
	const [AltTextBackdropVisible, setAltTextBackdropVisible] = useState(false);

	function altTextBackdropPressed() {
		setAltTextBackdropVisible(false);
	}

	function onAltTextClicked() {
		setAltTextBackdropVisible(true);
	}

	const MediaItem = useMemo(() => {
		const type = attachment?.getType();
		switch (type) {
			case 'image': {
				return (
					<Image
						style={{
							flex: 1,
							width: MEDIA_CONTAINER_WIDTH,
							borderRadius: 16,
						}}
						placeholder={{ blurhash: attachment?.getBlurHash() }}
						source={{ uri: attachment.getUrl() }}
					/>
				);
			}
			case 'video': {
				return (
					<TimelineVideoRendered
						url={attachment.getUrl()}
						height={CalculatedHeight}
					/>
				);
			}
			case 'gifv': {
				return (
					<TimelineVideoRendered
						url={attachment.getUrl()}
						height={CalculatedHeight}
						loop
					/>
				);
			}
			default: {
				console.log('[WARN]: unsupported media type', type);
				return <View></View>;
			}
		}
	}, [attachment, CalculatedHeight]);

	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				width: MEDIA_CONTAINER_WIDTH,
				height: CalculatedHeight,
				position: 'relative',
				marginTop: MARGIN_TOP,
			}}
		>
			{MediaItem}
			<Dialog
				isVisible={AltTextBackdropVisible}
				onBackdropPress={altTextBackdropPressed}
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

			{altText && (
				<View
					style={{
						position: 'absolute',
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
							onPress={onAltTextClicked}
						>
							<FontAwesome5
								name="info-circle"
								size={24}
								color={APP_FONT.MONTSERRAT_BODY}
							/>
						</Pressable>
					</View>
				</View>
			)}
		</View>
	);
}

function ImageCarousal({ attachments }: ImageCarousalProps) {
	const [CarousalData, setCarousalData] = useState({
		index: 0,
		total: attachments?.length,
	});

	function onCarousalItemChanged(e: any) {
		setCarousalData({
			index: e,
			total: attachments?.length,
		});
	}

	const CalculatedHeight = useMemo(() => {
		if (!attachments) return MEDIA_CONTAINER_MAX_HEIGHT;
		return MediaService.calculateHeightForMediaContentCarousal(attachments, {
			deviceWidth: Dimensions.get('window').width,
			maxHeight: MEDIA_CONTAINER_MAX_HEIGHT,
		});
	}, [attachments]);

	if (attachments?.length === 0) return <View></View>;
	if (attachments?.length === 1) {
		return (
			<TimelineMediaRendered
				attachment={attachments[0]}
				CalculatedHeight={CalculatedHeight}
				altText={attachments[0].getAltText()}
			/>
		);
	}
	return (
		<View style={{ marginTop: MARGIN_TOP }}>
			<View style={{ display: 'flex', flexDirection: 'row' }}>
				<View style={{ flexGrow: 1 }} />
				<Text
					style={{
						color: '#fff',
						opacity: 0.6,
						fontSize: 16,
					}}
				>
					{CarousalData.index + 1}/{CarousalData.total}
				</Text>
			</View>
			<Carousel
				width={Dimensions.get('window').width}
				height={CalculatedHeight}
				data={attachments}
				scrollAnimationDuration={1000}
				onSnapToItem={(index) => {
					onCarousalItemChanged(index);
				}}
				pagingEnabled={true}
				renderItem={(o) => (
					<TimelineMediaRendered
						attachment={o.item}
						CalculatedHeight={CalculatedHeight}
					/>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		// height: 500,
		// padding: 10,
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

export default ImageCarousal;
