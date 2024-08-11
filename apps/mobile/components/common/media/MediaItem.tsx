import { Dimensions, View } from 'react-native';
import { memo, useMemo } from 'react';
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
import AppImageCarousel from './fragments/AppImageCarousel';

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
	const _height = CalculatedHeight === 0 ? 360 : CalculatedHeight;

	const MediaItem = useMemo(() => {
		const type = attachment?.getType();

		switch (type) {
			case 'image':
			case 'image/jpeg':
			case 'image/png':
			case 'image/webp':
			case 'gifv':
			case 'image/gif':
			case 'image/avif': {
				return (
					<AppImageComponent
						url={attachment.getUrl()}
						blurhash={attachment.getBlurHash()}
						height={_height}
					/>
				);
			}
			case 'video':
			case 'video/mp4':
			case 'video/webm':
			case 'video/quicktime': {
				return (
					<AppVideoComponent
						type={'video'}
						url={attachment.getUrl()}
						height={_height}
					/>
				);
			}
			case 'audio':
			case 'audio/mpeg': {
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
				height: attachment.getType() === 'audio' ? 48 : _height,
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

const MediaItem = memo(function Foo({ attachments }: ImageCarousalProps) {
	const CalculatedHeight = useMemo(() => {
		if (!attachments) return MEDIA_CONTAINER_MAX_HEIGHT;
		return MediaService.calculateHeightForMediaContentCarousal(attachments, {
			deviceWidth: Dimensions.get('window').width - 32,
			maxHeight: MEDIA_CONTAINER_MAX_HEIGHT,
		});
	}, [attachments]);

	if (attachments?.length === 0) return <View></View>;
	if (attachments?.length === 1) {
		return (
			<TimelineMediaRendered
				attachment={attachments[0]}
				CalculatedHeight={CalculatedHeight}
				altText={attachments[0]?.getAltText()}
			/>
		);
	}
	return (
		<View style={{ marginTop: MARGIN_TOP, flex: 1 }}>
			<AppImageCarousel
				timelineCacheId={'1'}
				calculatedHeight={CalculatedHeight}
				items={attachments.map((o) => ({
					altText: o.getAltText(),
					src: o.getPreviewUrl(),
					type: o.getType(),
					blurhash: o.getBlurHash(),
				}))}
			/>
		</View>
	);
});

export default MediaItem;
