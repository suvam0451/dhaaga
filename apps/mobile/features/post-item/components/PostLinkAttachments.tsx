import { AppText } from '#/components/lib/Text';
import type { PostLinkAttachmentObjectType } from '@dhaaga/bridge/typings';
import { Dimensions, View } from 'react-native';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { Image } from 'expo-image';

type Props = {
	items: PostLinkAttachmentObjectType;
};

function PostLinkAttachments({ items }: Props) {
	const width = Dimensions.get('window').width - 40;
	const height =
		items.bannerHeight && items.bannerWidth
			? items.bannerHeight * (width / items.bannerWidth)
			: 200;

	return (
		<View>
			{items.map((item: PostLinkAttachmentObjectType) => (
				<View
					style={{
						padding: 4,
						borderColor: 'gray',
						borderWidth: 0.5,
						borderRadius: 8,
					}}
				>
					{item.bannerImageUrl ? (
						<Image
							source={{
								uri: item.bannerImageUrl,
							}}
							style={{
								height,
								width,
							}}
						/>
					) : (
						<View />
					)}
					<View
						style={{ padding: 4, paddingHorizontal: 6, paddingVertical: 12 }}
					>
						<AppText.Medium>{item.title}</AppText.Medium>
						<AppText.Medium emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}>
							{item.description}
						</AppText.Medium>
						<View
							style={{ height: 1.5, width: '100%', backgroundColor: 'gray' }}
						/>
					</View>
				</View>
			))}
		</View>
	);
}

export default PostLinkAttachments;
