import { View } from 'react-native';
import { memo, useMemo } from 'react';
import {
	AltTextOverlay,
	AppAudioComponent,
	AppImageComponent,
	AppVideoComponent,
	CarousalIndicatorOverlay,
} from './_shared';
import AppImageCarousel from './fragments/AppImageCarousel';
import useGalleryDims from '../../../hooks/app/useGalleryDims';
import { AppActivityPubMediaType } from '../../../services/app-status-dto.service';

type ImageCarousalProps = {
	attachments: AppActivityPubMediaType[];
	calculatedHeight: number;
};

/**
 * Media Renderer for a single item
 */
const TimelineMediaRendered = memo(function Foo({
	attachment,
	CalculatedHeight,
	altText,
	index,
	totalCount,
}: {
	attachment: AppActivityPubMediaType;
	CalculatedHeight: number;
	altText?: string;
	index?: number;
	totalCount?: number;
	leftMarginAdjustment?: number;
}) {
	const { ContainerWidth, ContainerHeight, onLayoutChanged } = useGalleryDims([
		{
			url: attachment.previewUrl,
			width: attachment.width,
			height: attachment.height,
		},
	]);

	const _height = CalculatedHeight === 0 ? 360 : CalculatedHeight;

	const MediaItem = useMemo(() => {
		const type = attachment.type;

		switch (type) {
			case 'image':
			case 'image/jpeg':
			case 'image/png':
			case 'image/webp':
			case 'image/gif':
			case 'image/avif': {
				return (
					<AppImageComponent
						url={attachment.previewUrl}
						blurhash={attachment.blurhash}
						parentContainerHeight={ContainerHeight}
						parentContainerWidth={ContainerWidth}
					/>
				);
			}
			case 'video':
			case 'video/mp4':
			case 'video/webm':
			case 'gifv':
			case 'video/quicktime': {
				return (
					<AppVideoComponent
						type={'video'}
						url={attachment.previewUrl}
						height={_height}
					/>
				);
			}
			case 'audio':
			case 'audio/mpeg': {
				return <AppAudioComponent url={attachment.url} />;
			}
			default: {
				console.log('[WARN]: unsupported media type', type);
				return <View></View>;
			}
		}
	}, [attachment, ContainerHeight, ContainerWidth]);

	return (
		<View onLayout={onLayoutChanged}>
			{MediaItem}
			<CarousalIndicatorOverlay index={index} totalCount={totalCount} />
			<AltTextOverlay altText={altText} />
		</View>
	);
});

const MediaItem = memo(function Foo({
	attachments,
	calculatedHeight,
}: ImageCarousalProps) {
	if (attachments === undefined || attachments === null) {
		console.log('[WARN]: no attachments');
	}

	if (!attachments) return <View />;

	if (attachments?.length === 0) return <View></View>;
	if (attachments?.length === 1) {
		return (
			<TimelineMediaRendered
				attachment={attachments[0]}
				CalculatedHeight={calculatedHeight}
				altText={attachments[0]?.alt}
			/>
		);
	}
	return (
		<AppImageCarousel
			timelineCacheId={'1'}
			calculatedHeight={calculatedHeight}
			items={attachments.map((o) => ({
				altText: o.alt,
				src: o.previewUrl,
				type: o.type,
				blurhash: o.blurhash,
			}))}
		/>
	);
});

export default MediaItem;
