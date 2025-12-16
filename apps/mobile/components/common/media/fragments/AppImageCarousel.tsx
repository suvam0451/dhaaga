import { useMemo } from 'react';
import { View } from 'react-native';
import {
	AltTextOverlay,
	AppAudioComponent,
	AppImageComponent,
	AppVideoComponent,
	CarousalIndicatorOverlay,
} from '../_shared';
import { GestureDetector } from 'react-native-gesture-handler';
import useCircularListSwipe from '#/hooks/useCircularListSwipe';
import useGalleryDims from '#/hooks/app/useGalleryDims';
import { appDimensions } from '#/styles/dimensions';
import type { PostMediaAttachmentType } from '@dhaaga/bridge';
import { MediaService } from '@dhaaga/core';

type MediaViewProps = {
	item: PostMediaAttachmentType;
	calculatedHeight: number;
	parentWidth: number;
};

function MediaView({ item, calculatedHeight, parentWidth }: MediaViewProps) {
	const MediaItem = useMemo(() => {
		if (MediaService.isImage(item.type)) {
			if (MediaService.isAnimatedImage(item.type)) {
				return (
					<AppVideoComponent
						type={'gifv'}
						url={item.url}
						containerHeight={calculatedHeight}
						containerWidth={parentWidth}
						loop
					/>
				);
			}
			return (
				<AppImageComponent
					url={item.url}
					blurhash={item.blurhash}
					parentContainerHeight={calculatedHeight}
					parentContainerWidth={parentWidth}
				/>
			);
		} else if (MediaService.isVideo(item.type)) {
			return (
				<AppVideoComponent
					type={'video'}
					url={item.url}
					containerHeight={calculatedHeight}
					containerWidth={parentWidth}
				/>
			);
		} else if (MediaService.isAudio(item.type)) {
			return <AppAudioComponent url={item.url} />;
		} else {
			return <View />;
		}
	}, [item.url, item.type, calculatedHeight, parentWidth]);

	return (
		<View
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				height: item.type === 'audio' ? 48 : calculatedHeight,
			}}
		>
			{MediaItem}
		</View>
	);
}

type AppImageCarouselProps = {
	items: PostMediaAttachmentType[];
	calculatedHeight: number;
	timelineCacheId: string;
};

function AppImageCarousel({ items, timelineCacheId }: AppImageCarouselProps) {
	const { ImageWidth, ImageHeight, onLayoutChanged } = useGalleryDims(
		items.map((o) => ({
			url: o.url,
			width: o.width,
			simpleVariantHeight: o.height,
		})),
	);

	const { Pointer, fling } = useCircularListSwipe(
		items.length,
		timelineCacheId,
	);
	const item = items[Pointer];

	return (
		<GestureDetector gesture={fling}>
			<View
				style={{
					marginBottom: appDimensions.timelines.sectionBottomMargin,
				}}
				onLayout={onLayoutChanged}
			>
				<MediaView
					item={item}
					parentWidth={ImageWidth}
					calculatedHeight={ImageHeight}
				/>
				<CarousalIndicatorOverlay index={Pointer} total={items?.length} />
				<AltTextOverlay altText={item?.alt} />
			</View>
		</GestureDetector>
	);
}

export default AppImageCarousel;
