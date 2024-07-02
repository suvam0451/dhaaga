import { ActivityPubMediaAttachment } from '../../../entities/activitypub-media-attachment.entity';
import { useMemo, useState } from 'react';
import MediaService from '../../../services/media.service';
import { Dimensions, View } from 'react-native';
import { MEDIA_CONTAINER_MAX_HEIGHT, MEDIA_CONTAINER_WIDTH } from './_common';
import { AppImageComponent, AppVideoComponent } from './_shared';
import MediaContainerWithAltText from '../../containers/MediaContainerWithAltText';

function RealmMediaComponentSingleItem({
	data,
	height,
}: {
	data: ActivityPubMediaAttachment;
	height: number;
}) {
	const MediaItem = useMemo(() => {
		const type = data.type;
		switch (type) {
			case 'image': {
				return (
					<AppImageComponent url={data.previewUrl} blurhash={data.blurhash} />
				);
			}
			case 'video': {
				return <AppVideoComponent url={data.previewUrl} height={height} />;
			}
			case 'gifv': {
				return <AppVideoComponent url={data.previewUrl} height={height} loop />;
			}
			default: {
				console.log('[WARN]: unsupported media type', type);
				return <View></View>;
			}
		}
	}, [data, height]);

	return (
		<MediaContainerWithAltText
			altText={data.altText}
			width={MEDIA_CONTAINER_WIDTH}
			height={height}
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
	const [CarousalData, setCarousalData] = useState({
		index: 0,
		total: data.length,
	});

	function onCarousalItemChanged(e: any) {
		setCarousalData({
			index: e,
			total: data.length,
		});
	}

	const CalculatedHeight = useMemo(() => {
		return MediaService.calculateHeightRealmAttachments(data, {
			deviceWidth: Dimensions.get('window').width,
			maxHeight: MEDIA_CONTAINER_MAX_HEIGHT,
		});
	}, [data]);

	if (data.length === 0) return <View></View>;
	if (data.length === 1)
		return (
			<RealmMediaComponentSingleItem data={data[0]} height={CalculatedHeight} />
		);
}

export default RealmMediaItem;
