import { ActivityPubMediaAttachment } from '../../../entities/activitypub-media-attachment.entity';
import { useMemo } from 'react';
import MediaService from '../../../services/media.service';
import { Dimensions, View } from 'react-native';
import { MEDIA_CONTAINER_MAX_HEIGHT } from './_common';
import { AppImageComponent, AppVideoComponent } from './_shared';
import MediaContainerWithAltText from '../../containers/MediaContainerWithAltText';
import useImageAspectRatio from '../../../hooks/app/useImageAspectRatio';

function RealmMediaComponentSingleItem({
	data,
	height,
}: {
	data: ActivityPubMediaAttachment;
	height: number;
}) {
	const { Width, Height, onLayoutChanged } = useImageAspectRatio([
		{
			url: data.url,
			height: data.height,
			width: data.width,
		},
	]);

	const MediaItem = useMemo(() => {
		const type = data.type;
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
						url={data.previewUrl}
						blurhash={data.blurhash}
						height={Height}
						width={Width}
					/>
				);
			}
			case 'video':
			case 'video/mp4':
			case 'video/webm':
			case 'video/quicktime': {
				return (
					<AppVideoComponent url={data.url} height={height} type={'video'} />
				);
			}
			default: {
				console.log('[WARN]: unsupported media type', type);
				return <View></View>;
			}
		}
	}, [data, Width, Height]);

	return (
		<MediaContainerWithAltText
			altText={data.altText}
			width={Width}
			height={Height}
			onLayoutChanged={onLayoutChanged}
		>
			{MediaItem}
		</MediaContainerWithAltText>
	);
}

type Props = {
	data: ActivityPubMediaAttachment[];
};

/**
 * Media renderer for db-loaded posts
 * @param data
 * @constructor
 */
function RealmMediaItem({ data }: Props) {
	let CalculatedHeight = useMemo(() => {
		return MediaService.calculateHeightRealmAttachments(data, {
			deviceWidth: Dimensions.get('window').width,
			maxHeight: MEDIA_CONTAINER_MAX_HEIGHT,
		});
	}, [data]);
	if (CalculatedHeight === 0) {
		CalculatedHeight = 520;
	}

	if (data.length === 0) return <View></View>;
	if (data.length === 1)
		return (
			<RealmMediaComponentSingleItem data={data[0]} height={CalculatedHeight} />
		);
}

export default RealmMediaItem;
