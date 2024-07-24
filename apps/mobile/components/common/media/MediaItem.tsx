import { Dimensions, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { MediaAttachmentInterface } from '@dhaaga/shared-abstraction-activitypub';
import MediaService from '../../../services/media.service';
import {
	MARGIN_TOP,
	MEDIA_CONTAINER_MAX_HEIGHT,
	MEDIA_CONTAINER_WIDTH,
} from './_common';
import {
	AltTextOverlay,
	AppAudioComponent,
	AppImageComponent,
	AppVideoComponent,
	CarousalIndicatorOverlay,
} from './_shared';

type ImageCarousalProps = {
	attachments: MediaAttachmentInterface[];
};

const TimelineMediaRendered = memo(function Foo({
	attachment,
	CalculatedHeight,
	altText,
	index,
	totalCount,
}: {
	attachment: MediaAttachmentInterface;
	CalculatedHeight: number;
	altText?: string;
	index?: number;
	totalCount?: number;
}) {
	const MediaItem = useMemo(() => {
		const type = attachment?.getType();

		switch (type) {
			case 'image':
			case 'image/jpeg':
			case 'image/png':
			case 'image/webp': {
				return (
					<AppImageComponent
						url={attachment.getPreviewUrl()}
						blurhash={attachment.getBlurHash()}
					/>
				);
			}
			case 'video':
			case 'video/mp4': {
				return (
					<AppVideoComponent
						type={'video'}
						url={attachment.getUrl()}
						height={CalculatedHeight}
					/>
				);
			}
			case 'gifv':
			case 'image/gif': {
				return (
					<AppVideoComponent
						type={'gifv'}
						url={attachment.getUrl()}
						height={CalculatedHeight}
						loop
					/>
				);
			}
			case 'audio': {
				return <AppAudioComponent url={attachment.getUrl()} />;
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
				height: attachment.getType() === 'audio' ? 48 : CalculatedHeight,
				position: 'relative',
				marginTop: MARGIN_TOP,
			}}
		>
			{MediaItem}
			<CarousalIndicatorOverlay index={index} totalCount={totalCount} />
			<AltTextOverlay altText={altText} />
		</View>
	);
});

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

	const onCarousalItemChanged = useCallback(
		(e: any) => {
			setCarousalData({
				index: e,
				total: attachments?.length,
			});
		},
		[attachments],
	);

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
		<View style={{ marginTop: MARGIN_TOP, flex: 1 }}>
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
						totalCount={CarousalData.total}
						index={CarousalData.index}
					/>
				)}
			/>
		</View>
	);
}

export default MediaItem;
