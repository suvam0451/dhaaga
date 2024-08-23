import { View } from 'react-native';
import { memo, useMemo } from 'react';
import { MARGIN_TOP } from './_common';
import {
	AltTextOverlay,
	AppAudioComponent,
	AppImageComponent,
	AppVideoComponent,
	CarousalIndicatorOverlay,
} from './_shared';
import AppImageCarousel from './fragments/AppImageCarousel';
import { AppActivityPubMediaType } from '../../../services/ap-proto/activitypub-status-dto.service';

type ImageCarousalProps = {
	attachments: AppActivityPubMediaType[];
	calculatedHeight: number;
	leftMarginAdjustment?: number;
};

const TimelineMediaRendered = memo(function Foo({
	attachment,
	CalculatedHeight,
	altText,
	index,
	totalCount,
	leftMarginAdjustment,
}: {
	attachment: AppActivityPubMediaType;
	CalculatedHeight: number;
	altText?: string;
	index?: number;
	totalCount?: number;
	leftMarginAdjustment?: number;
}) {
	const _height = CalculatedHeight === 0 ? 360 : CalculatedHeight;

	const MediaItem = useMemo(() => {
		const type = attachment.type;

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
						url={attachment.url}
						blurhash={attachment.blurhash}
						height={_height}
						leftMarginAdjustment={leftMarginAdjustment}
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
	}, [attachment, CalculatedHeight]);

	return (
		<View
			style={{
				marginTop: MARGIN_TOP,
			}}
		>
			{MediaItem}
			<CarousalIndicatorOverlay index={index} totalCount={totalCount} />
			<AltTextOverlay altText={altText} />
		</View>
	);
});

const MediaItem = memo(function Foo({
	attachments,
	calculatedHeight,
	leftMarginAdjustment,
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
				leftMarginAdjustment={leftMarginAdjustment}
			/>
		);
	}
	return (
		<View style={{ marginTop: MARGIN_TOP, flex: 1 }}>
			<AppImageCarousel
				timelineCacheId={'1'}
				calculatedHeight={calculatedHeight}
				leftMarginAdjustment={leftMarginAdjustment}
				items={attachments.map((o) => ({
					altText: o.alt,
					src: o.url,
					type: o.type,
					blurhash: o.blurhash,
				}))}
			/>
		</View>
	);
});

export default MediaItem;
