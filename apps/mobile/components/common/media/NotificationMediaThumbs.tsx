import { AppActivityPubMediaType } from '../../../services/app-status-dto.service';
import { FlatList, View } from 'react-native';
import { Image } from 'expo-image';
import { useImageAutoHeight } from '../../../hooks/app/useImageDims';
import { appDimensions } from '../../../styles/dimensions';
import { AppPostObject } from '../../../types/app-post.types';

type ThumbItemProps = {
	item: AppActivityPubMediaType;
	post: AppPostObject;
};

function ThumbItem({ item, post }: ThumbItemProps) {
	const Data = useImageAutoHeight(item, 100, 200);

	if (!Data.resolved) return <View />;
	return (
		<View style={{ marginRight: 8 }}>
			{/*@ts-ignore-next-line*/}
			<Image
				contentFit="fill"
				style={{
					// flex: 1,
					borderRadius: 16,
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
	items: AppActivityPubMediaType[];
	post: AppPostObject;
};

function NotificationMediaThumbs({ items, post }: Props) {
	if (items.length === 0) return <View />;

	return (
		<FlatList
			horizontal={true}
			data={items}
			renderItem={(item) => <ThumbItem item={item.item} post={post} />}
			style={{
				marginBottom: appDimensions.timelines.sectionBottomMargin,
				marginTop: 8,
			}}
		/>
	);
}

export default NotificationMediaThumbs;
