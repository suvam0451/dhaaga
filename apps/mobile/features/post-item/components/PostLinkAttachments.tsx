import type { PostLinkAttachmentObjectType } from '@dhaaga/bridge';
import { Dimensions, Pressable, View } from 'react-native';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { Image } from 'expo-image';
import { NativeTextMedium } from '#/ui/NativeText';
import { BaseUrlNormalizationService } from '@dhaaga/bridge';
import { AppDividerSoft } from '#/ui/Divider';
import { AttachedLinkBorderDecorations } from '#/skins/BorderDecorations';
import { useAppBottomSheet } from '#/states/global/hooks';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';

type Props = {
	items: PostLinkAttachmentObjectType[];
	isPreview?: boolean;
};

function PostLinkAttachments({ items }: Props) {
	const { show } = useAppBottomSheet();

	if (items.length === 0) return <View />;
	const item = items[0];

	const width = Dimensions.get('window').width - 40;
	const height =
		item.bannerHeight && item.bannerWidth
			? item.bannerHeight * (width / item.bannerWidth)
			: 200;

	function onPress(attachment: PostLinkAttachmentObjectType) {
		show(APP_BOTTOM_SHEET_ENUM.LINK, true, {
			$type: 'link-preview',
			linkAttachment: attachment,
		});
	}

	return (
		<View>
			{items.map((item: PostLinkAttachmentObjectType, i) => (
				<Pressable
					key={i}
					onPress={() => {
						onPress(item);
					}}
				>
					<AttachedLinkBorderDecorations>
						{item.bannerImageUrl ? (
							<Image
								source={{
									uri: item.bannerImageUrl,
								}}
								style={{
									height,
									width,
									borderTopLeftRadius: 8,
									borderTopRightRadius: 8,
								}}
							/>
						) : (
							<View />
						)}
						<View style={{ padding: 6, paddingVertical: 12 }}>
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
				</Pressable>
			))}
		</View>
	);
}

export default PostLinkAttachments;
