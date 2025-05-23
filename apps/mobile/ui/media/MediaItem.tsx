import { StyleProp, View, ViewStyle } from 'react-native';
import { useMemo } from 'react';
import {
	AltTextOverlay,
	AppAudioComponent,
	AppImageComponent,
	AppVideoComponent,
	CarousalIndicatorOverlay,
} from '../../components/common/media/_shared';
import AppImageCarousel from '../../components/common/media/fragments/AppImageCarousel';
import useGalleryDims from '../../hooks/app/useGalleryDims';
import type { PostMediaAttachmentType } from '@dhaaga/bridge';
import { appDimensions } from '../../styles/dimensions';

type ImageCarousalProps = {
	attachments: PostMediaAttachmentType[];
	calculatedHeight: number;
	style?: StyleProp<ViewStyle>;
};

/**
 * Media Renderer for a single item
 */
function TimelineMediaRendered({
	attachment,
	altText,
	index,
	totalCount,
}: {
	attachment: PostMediaAttachmentType;
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
						containerHeight={ContainerHeight}
						containerWidth={ContainerWidth}
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
						flex: 1,
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
		<View style={style}>
			<AppImageCarousel
				timelineCacheId={'1'}
				calculatedHeight={calculatedHeight}
				items={attachments}
			/>
		</View>
	);
}

export default MediaItem;
