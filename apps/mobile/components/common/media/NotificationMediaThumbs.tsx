import { AppActivityPubMediaType } from '../../../services/approto/app-status-dto.service';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { useImageAutoWidth } from '../../../hooks/app/useImageDims';

type ThumbItemProps = {
	item: AppActivityPubMediaType;
};

function ThumbItem({ item }: ThumbItemProps) {
	const Data = useImageAutoWidth(item, 100, 200);

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
					uri: item.url,
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
	maxH: number; // not used for now
};

function NotificationMediaThumbs({ items, maxH }: Props) {
	if (items.length === 0) return <View />;

	return (
		<View style={{ flexDirection: 'row', overflow: 'scroll', marginTop: 8 }}>
			{items.map((item, i) => (
				<ThumbItem key={i} item={item} />
			))}
		</View>
	);
}

export default NotificationMediaThumbs;
