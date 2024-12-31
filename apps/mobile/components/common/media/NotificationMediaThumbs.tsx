import { FlatList, View } from 'react-native';
import { Image } from 'expo-image';
import { useImageAutoHeight } from '../../../hooks/app/useImageDims';
import { appDimensions } from '../../../styles/dimensions';
import { AppMediaObject, AppPostObject } from '../../../types/app-post.types';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import ActivityPubService from '../../../services/activitypub.service';

type ThumbItemProps = {
	item: AppMediaObject;
	post: AppPostObject;
	server?: KNOWN_SOFTWARE;
};

function ThumbItem({ item, post, server }: ThumbItemProps) {
	const Data = useImageAutoHeight(item, 100, 200);

	// too resource expensive
	// const isMastodonLike = ActivityPubService.mastodonLike(server);

	if (!Data.resolved) return <View />;
	return (
		<View style={{ marginRight: 8 }}>
			{/*@ts-ignore-next-line*/}
			<Image
				contentFit="fill"
				style={{
					// flex: 1,
					borderRadius: 8,
					opacity: 0.87,
					width: Data.width,
					height: Data.height,
					alignItems: 'center',
					justifyContent: 'center',
				}}
				source={{
					uri: item.previewUrl,
				}}
				transition={{
					effect: 'flip-from-right',
					duration: 120,
					timing: 'ease-in',
				}}
			/>
		</View>
	);
}

type Props = {
	items: AppMediaObject[];
	post: AppPostObject;
	server?: KNOWN_SOFTWARE;
};

function NotificationMediaThumbs({ items, post, server }: Props) {
	if (items.length === 0) return <View />;

	return (
		<FlatList
			horizontal={true}
			data={items}
			renderItem={(item) => (
				<ThumbItem item={item.item} post={post} server={server} />
			)}
			style={{
				marginBottom: appDimensions.timelines.sectionBottomMargin,
				marginTop: 8,
			}}
		/>
	);
}

export default NotificationMediaThumbs;
