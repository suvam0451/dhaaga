import type { PostLinkAttachmentObjectType } from '@dhaaga/bridge';
import { Dimensions, View } from 'react-native';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { Image } from 'expo-image';
import { NativeTextMedium } from '#/ui/NativeText';
import { BaseUrlNormalizationService } from '@dhaaga/bridge';
import { AppDividerSoft } from '#/ui/Divider';
import { AttachedLinkBorderDecorations } from '#/skins/BorderDecorations';

type Props = {
	items: PostLinkAttachmentObjectType[];
};

function PostLinkAttachments({ items }: Props) {
	if (items.length === 0) return <View />;
	const item = items[0];

	const width = Dimensions.get('window').width - 40;
	const height =
		item.bannerHeight && item.bannerWidth
			? item.bannerHeight * (width / item.bannerWidth)
			: 200;

	return (
		<View>
			{items.map((item: PostLinkAttachmentObjectType, i) => (
				<AttachedLinkBorderDecorations key={i}>
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
						<NativeTextMedium numberOfLines={3} style={{ marginBottom: 4 }}>
							{item.title}
						</NativeTextMedium>
						<NativeTextMedium
							numberOfLines={5}
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}
						>
							{item.description}
						</NativeTextMedium>
						<AppDividerSoft style={{ marginVertical: 6 }} />
						<NativeTextMedium>
							{BaseUrlNormalizationService.stripHttps(item.url)}
						</NativeTextMedium>
					</View>
				</AttachedLinkBorderDecorations>
			))}
		</View>
	);
}

export default PostLinkAttachments;
