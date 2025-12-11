import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import AppLoadingIndicator from '../../error-screen/AppLoadingIndicator';
import ReadMoreText from '../../utils/ReadMoreText';
import { OpenGraphUtil } from '#/utils/og.utils';
import { Image } from 'expo-image';
import { APP_FONTS } from '#/styles/AppFonts';
import { AppMenu } from '../../lib/Menu';
import { AppIcon } from '../../lib/Icon';
import { AppDivider } from '../../lib/Divider';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { LinkingUtils } from '#/utils/linking.utils';
import { useAppBottomSheet, useAppTheme } from '#/states/global/hooks';
import { appDimensions } from '#/styles/dimensions';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import BottomSheetActionMenuBuilder from '#/ui/BottomSheetActionMenuBuilder';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';

type OpenGraphParsingState = {
	key: string | null;
	parsed: boolean;
	loading: boolean;
	og: any | null;
};

const OgDefault: OpenGraphParsingState = {
	key: null,
	parsed: false,
	loading: false,
	og: null,
};

type ParsingFailedViewProps = {
	onRetry: () => void;
	onOpenExternal: () => void;
	onCopy: () => void;
	copied: boolean;
};

function ParsingFailedView({
	onRetry,
	onOpenExternal,
	onCopy,
	copied,
}: ParsingFailedViewProps) {
	const { theme } = useAppTheme();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SHEETS]);

	return (
		<View style={{ marginTop: 48 }}>
			<Text
				style={{
					color: theme.complementary.a0,
					fontSize: 20,
					marginHorizontal: 10,
					fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
					marginBottom: 16,
				}}
			>
				{t(`linkPreview.failedStateLabel`)}
			</Text>
			<BottomSheetActionMenuBuilder
				items={[
					{
						appIconId: 'external-link',
						label: t(`linkPreview.menuLabel_retry`),
						onPress: onRetry,
					},
					{
						appIconId: 'copy',
						label: t(`linkPreview.menuLabel_copyLink`),
						onPress: onCopy,
						activeLabel: 'Copied!',
						active: copied,
					},
					{
						appIconId: 'browser',
						label: t(`linkPreview.menu_openInBrowser_label`),
						description: t(`linkPreview.menu_openInBrowser_desc`),
						onPress: onOpenExternal,
					},
				]}
			/>
		</View>
	);
}

function ABS_Link_Preview() {
	const { theme } = useAppTheme();
	const { ctx, stateId, visible, type, hide } = useAppBottomSheet();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SHEETS]);

	const [SavedToClipboard, setSavedToClipboard] = useState(false);
	const ValueRef = useRef<string>(null);
	const [OpenGraph, setOpenGraph] = useState(OgDefault);

	const INACTIVE = !visible || type !== APP_BOTTOM_SHEET_ENUM.LINK;

	function placeholder() {}

	useEffect(() => {
		if (ctx.$type !== 'link-preview') return hide();
		setSavedToClipboard(false);
		ValueRef.current = ctx.url;
	}, [stateId]);

	const domain = useMemo(() => {
		if (!OpenGraph) return '';
		try {
			let domain = new URL(OpenGraph.og?.url);
			return domain.hostname;
		} catch (e) {
			return OpenGraph.og?.url;
		}
	}, [OpenGraph]);

	if (INACTIVE) return <View />;

	if (OpenGraph.loading) {
		return (
			<View>
				<AppLoadingIndicator text={'Loading Preview'} />
			</View>
		);
	}

	function onLinkCopy() {
		LinkingUtils.saveToClipboard(ValueRef.current)
			.then(() => {
				setSavedToClipboard(true);
			})
			.catch((e) => {
				console.log(e, ValueRef.current);
				setSavedToClipboard(false);
			});
	}

	function onOpenExternal() {
		LinkingUtils.openURL(ValueRef.current);
	}

	const obj = OpenGraphUtil.parseOgObject(OpenGraph.og);

	if (!OpenGraph.loading && !OpenGraph.parsed) {
		return (
			<ParsingFailedView
				onRetry={placeholder}
				onCopy={onLinkCopy}
				copied={SavedToClipboard}
				onOpenExternal={onOpenExternal}
			/>
		);
	}

	let _url = ValueRef.current;
	_url = _url?.replace(/(https:\/\/)(.+)/, '$2');
	_url = _url?.replace(/(www\.)(.+)/, _url);

	return (
		<ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
			<View>
				{obj.image ? (
					<Image
						source={{
							uri: obj.image,
						}}
						cachePolicy={'none'}
						contentFit={'cover'}
						style={styles.banner}
					/>
				) : (
					<View style={styles.noBanner} />
				)}
			</View>

			<View style={{ paddingHorizontal: 12 }}>
				<ReadMoreText
					text={domain}
					maxLines={1}
					textStyle={{
						color: theme.primary.a0,
						fontSize: 16,
						fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
					}}
				/>
				<ReadMoreText
					text={obj.title}
					maxLines={1}
					textStyle={{
						color: theme.secondary.a0,
						fontSize: 20,
						fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
						marginTop: 8,
					}}
				/>
				<ReadMoreText
					text={obj.desc}
					maxLines={2}
					textStyle={{
						color: theme.secondary.a20,
						fontSize: 16,
						marginVertical: 4,
					}}
				/>
			</View>
			<AppDivider.Hard
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
