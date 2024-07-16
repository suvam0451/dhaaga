import { MediaAttachmentInterface } from '@dhaaga/shared-abstraction-activitypub';
import { Dimensions, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { memo, useMemo } from 'react';
import { MEDIA_CONTAINER_MAX_HEIGHT } from '../../media/_common';
import MediaService from '../../../../services/media.service';
import { AppImageComponent } from '../../media/_shared';

type Props = {
	items: MediaAttachmentInterface[];
};

type CarousalItemProps = {
	url: string;
	blurhash: string;
};

const CarousalItem = memo(function Foo({ url, blurhash }: CarousalItemProps) {
	return (
		<View style={{ height: '100%' }}>
			<AppImageComponent url={url} blurhash={blurhash} />
		</View>
	);
});

function ProfileImageGalleryCarousal({ items }: Props) {
	const CalculatedHeight = useMemo(() => {
		if (!items) return MEDIA_CONTAINER_MAX_HEIGHT;
		return MediaService.calculateHeightForMediaContentCarousal(items, {
			deviceWidth: Dimensions.get('window').width,
			maxHeight: MEDIA_CONTAINER_MAX_HEIGHT,
		});
	}, [items]);

	return (
		<View
			style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Carousel
				height={CalculatedHeight}
				width={Dimensions.get('window').width}
				data={items}
				scrollAnimationDuration={160}
				renderItem={({ item }: { item: MediaAttachmentInterface }) => (
					<CarousalItem blurhash={item.getBlurHash()} url={item.getUrl()} />
				)}
				panGestureHandlerProps={{
					activeOffsetX: [-10, 10], // Enable horizontal panning
					failOffsetY: [-5, 5], // Limit vertical movement to fail the gesture
				}}
				pagingEnabled={true}
			/>
		</View>
	);
}

export default ProfileImageGalleryCarousal;
