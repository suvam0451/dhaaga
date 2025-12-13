import { ScrollView, View, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { AppMenu } from '../../lib/Menu';
import { AppIcon } from '../../lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { LinkingUtils } from '#/utils/linking.utils';
import { useAppBottomSheet, useAppTheme } from '#/states/global/hooks';
import { appDimensions } from '#/styles/dimensions';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { AppDividerHard } from '#/ui/Divider';
import type { PostLinkAttachmentObjectType } from '@dhaaga/bridge';

function ABS_Link_Preview() {
	const { theme } = useAppTheme();
	const { ctx, stateId, visible, hide } = useAppBottomSheet();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SHEETS]);

	const [Attachment, setAttachment] =
		useState<PostLinkAttachmentObjectType | null>(null);

	useEffect(() => {
		if (!ctx || ctx.$type !== 'link-preview') return hide();
		setAttachment(ctx.linkAttachment);
	}, [stateId]);

	if (visible || !Attachment) return <View />;

	function onLinkCopy() {
		LinkingUtils.shareUrl(Attachment.url);
	}

	function onOpenExternal() {
		LinkingUtils.openURL(Attachment.url);
	}

	let _url = Attachment.url;
	_url = _url?.replace(/(https:\/\/)(.+)/, '$2');
	_url = _url?.replace(/(www\.)(.+)/, _url);

	return (
		<ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
			<View>
				{Attachment.bannerImageUrl ? (
					<Image
						source={{
							uri: Attachment.bannerImageUrl,
						}}
						cachePolicy={'none'}
						contentFit={'cover'}
						style={styles.banner}
					/>
				) : (
					<View style={styles.noBanner} />
				)}
			</View>
			<AppDividerHard
				style={{
					marginVertical: MARGIN_BOTTOM,
					marginTop: 16,
					marginHorizontal: 10,
					backgroundColor: theme.background.a50,
				}}
			/>
			<AppMenu.Option
				appIconId={
					<AppIcon id={'copy'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
				}
				label={t(`linkPreview.menuLabel_copyLink`)}
				onPress={onLinkCopy}
			/>
			<AppMenu.Option
				appIconId={
					<AppIcon id={'browser'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
				}
				label={t(`linkPreview.menu_openInBrowser_label`)}
				onPress={onOpenExternal}
				desc={t(`linkPreview.menu_openInBrowser_desc`)}
			/>
		</ScrollView>
	);
}

export default ABS_Link_Preview;

const MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

const styles = StyleSheet.create({
	noBanner: {
		borderTopLeftRadius: appDimensions.bottomSheet.borderRadius,
		borderTopRightRadius: appDimensions.bottomSheet.borderRadius,
		marginBottom: MARGIN_BOTTOM * 1.5,
		marginTop: appDimensions.bottomSheet.clearanceTop,
	},
	banner: {
		width: '100%',
		minHeight: 172,
		maxHeight: 256,
		borderTopLeftRadius: appDimensions.bottomSheet.borderRadius,
		borderTopRightRadius: appDimensions.bottomSheet.borderRadius,
		marginBottom: MARGIN_BOTTOM * 1.5,
	},
});
