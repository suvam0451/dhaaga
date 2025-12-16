import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { useMemo } from 'react';
import {
	AltTextOverlay,
	AppAudioComponent,
	AppImageComponent,
	AppVideoComponent,
	CarousalIndicatorOverlay,
} from '#/components/common/media/_shared';
import AppImageCarousel from '#/components/common/media/fragments/AppImageCarousel';
import useGalleryDims from '#/hooks/app/useGalleryDims';
import type { PostMediaAttachmentType } from '@dhaaga/bridge';
import { appDimensions } from '#/styles/dimensions';
import { MediaAttachmentViewer } from '@dhaaga/bridge';

type ImageCarousalProps = {
	attachments: PostMediaAttachmentType[];
	calculatedHeight: number;
	style?: StyleProp<ViewStyle>;
	onPress: () => void;
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
			simpleVariantHeight: attachment.height,
		},
	]);

	const MediaItem = useMemo(() => {
		if (MediaAttachmentViewer.isImage(attachment)) {
			if (MediaAttachmentViewer.isAnimatedImage(attachment)) {
				return (
					<AppVideoComponent
						type={'video'}
						url={attachment.url}
						containerHeight={ContainerHeight}
						containerWidth={ContainerWidth}
					/>
				);
			} else {
				return (
					<AppImageComponent
						url={attachment.previewUrl}
						blurhash={attachment.blurhash}
						parentContainerHeight={ContainerHeight}
						parentContainerWidth={ContainerWidth}
					/>
				);
			}
		} else if (MediaAttachmentViewer.isVideo(attachment)) {
			return (
				<AppVideoComponent
					type={'video'}
					url={attachment.url}
					containerHeight={ContainerHeight}
					containerWidth={ContainerWidth}
				/>
			);
		} else if (MediaAttachmentViewer.isAudio(attachment)) {
			return <AppAudioComponent url={attachment.url} />;
		} else {
			console.log('[WARN]: unsupported media type', attachment);
			return <View></View>;
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
	onPress,
}: ImageCarousalProps) {
	if (!attachments || attachments.length === 0) return <View />;

	if (attachments.length === 1) {
		if (MediaAttachmentViewer.isVideo(attachments[0])) {
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
		} else {
			return (
				<Pressable
					style={[
						{
							marginBottom: appDimensions.timelines.sectionBottomMargin,
							flex: 1,
						},
						style,
					]}
					onPress={onPress}
				>
					<TimelineMediaRendered
						attachment={attachments[0]}
						CalculatedHeight={calculatedHeight}
						altText={attachments[0]?.alt}
						totalCount={1}
					/>
				</Pressable>
			);
		}
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
