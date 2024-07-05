import { Dimensions, View, Text, Pressable } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MediaAttachmentInterface } from '@dhaaga/shared-abstraction-activitypub/src';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { APP_FONT } from '../../../styles/AppTheme';
import { Dialog } from '@rneui/themed';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MediaService from '../../../services/media.service';
import {
	MARGIN_TOP,
	MEDIA_CONTAINER_MAX_HEIGHT,
	MEDIA_CONTAINER_WIDTH,
} from './_common';
import { AltTextDialog, AppImageComponent, AppVideoComponent } from './_shared';

type ImageCarousalProps = {
	attachments: MediaAttachmentInterface[];
};

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
					<AppImageComponent
						url={attachment.getUrl()}
						blurhash={attachment.getBlurHash()}
					/>
				);
			}
			case 'video': {
				return (
					<AppVideoComponent
						type={'video'}
						url={attachment.getUrl()}
						height={CalculatedHeight}
					/>
				);
			}
			case 'gifv': {
				return (
					<AppVideoComponent
						type={'gifv'}
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
			<AltTextDialog altText={altText} />
		</View>
	);
}

function MediaItem({ attachments }: ImageCarousalProps) {
	const [CarousalData, setCarousalData] = useState({
		index: 0,
		total: attachments?.length,
	});

	useEffect(() => {
		setCarousalData({
			index: 0,
			total: attachments?.length,
		});
	}, [attachments]);

	const onCarousalItemChanged = useCallback((e: any) => {
		setCarousalData({
			index: e,
			total: attachments?.length,
		});
	}, []);

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
				scrollAnimationDuration={160}
				onSnapToItem={(index: number) => {
					onCarousalItemChanged(index);
				}}
				panGestureHandlerProps={{
					activeOffsetX: [-10, 10], // Enable horizontal panning
					failOffsetY: [-5, 5], // Limit vertical movement to fail the gesture
				}}
				pagingEnabled={true}
				renderItem={(o: any) => (
					<TimelineMediaRendered
						attachment={o.item}
						CalculatedHeight={CalculatedHeight}
					/>
				)}
			/>
		</View>
	);
}

export default MediaItem;
