import { StyleProp, View, ViewStyle } from 'react-native';
import { useMemo } from 'react';
import {
	AltTextOverlay,
	AppAudioComponent,
	AppImageComponent,
	AppVideoComponent,
	CarousalIndicatorOverlay,
} from './_shared';
import AppImageCarousel from './fragments/AppImageCarousel';
import useGalleryDims from '../../../hooks/app/useGalleryDims';
import { AppMediaObject } from '../../../types/app-post.types';
import { appDimensions } from '../../../styles/dimensions';

type ImageCarousalProps = {
	attachments: AppMediaObject[];
	calculatedHeight: number;
	style?: StyleProp<ViewStyle>;
};

/**
 * Media Renderer for a single item
 */
function TimelineMediaRendered({
	attachment,
	CalculatedHeight,
	altText,
	index,
	totalCount,
}: {
	attachment: AppMediaObject;
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
						url={attachment.url}
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
			<CarousalIndicatorOverlay index={index} total={totalCount} />
			<AltTextOverlay altText={altText} />
		</View>
	);
}

function MediaItem({
	attachments,
	calculatedHeight,
	style,
}: ImageCarousalProps) {
	if (!attachments || attachments.length === 0) return <View />;

	if (attachments.length === 1) {
		return (
			<View
				style={[
					{
						marginBottom: appDimensions.timelines.sectionBottomMargin,
					},
					style,
				]}
			>
				<TimelineMediaRendered
					attachment={attachments[0]}
					CalculatedHeight={calculatedHeight}
					altText={attachments[0]?.alt}
					totalCount={1}
				/>
			</View>
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
}

export default MediaItem;
