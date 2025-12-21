import type { PostLinkAttachmentObjectType } from '@dhaaga/bridge';
import { BaseUrlNormalizationService } from '@dhaaga/bridge';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { Image } from 'expo-image';
import { NativeTextBold, NativeTextNormal } from '#/ui/NativeText';
import { AppDividerSoft } from '#/ui/Divider';
import { useAppBottomSheet } from '#/states/global/hooks';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';
import { ThemedLinkAttachmentOrnament } from '#/features/skins/components/ThemedBorderDecorations';

type Props = {
	items: PostLinkAttachmentObjectType[];
	isPreview?: boolean;
};

function PostLinkAttachmentListView({ items }: Props) {
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
				<TouchableOpacity
					delayPressIn={200}
					key={i}
					onPress={() => {
						onPress(item);
					}}
				>
					<ThemedLinkAttachmentOrnament>
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
						<View style={{ padding: 6, paddingTop: 12 }}>
							<NativeTextBold
								emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
								numberOfLines={3}
								style={{ marginBottom: 4 }}
							>
								{item.title}
							</NativeTextBold>
							<NativeTextNormal
								numberOfLines={5}
								emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}
							>
								{item.description}
							</NativeTextNormal>
							<AppDividerSoft style={{ marginVertical: 6 }} />
							<NativeTextBold emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}>
								{BaseUrlNormalizationService.stripHttps(item.url)}
							</NativeTextBold>
						</View>
					</ThemedLinkAttachmentOrnament>
				</TouchableOpacity>
			))}
		</View>
	);
}

export default PostLinkAttachmentListView;
