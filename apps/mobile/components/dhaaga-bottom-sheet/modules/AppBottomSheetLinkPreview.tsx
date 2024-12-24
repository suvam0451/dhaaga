import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { ScrollView, View, Text } from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getLinkPreview } from 'link-preview-js';
import AppLoadingIndicator from '../../error-screen/AppLoadingIndicator';
import ReadMoreText from '../../utils/ReadMoreText';
import { OpenGraphUtil } from '../../../utils/og.utils';
import { Image } from 'expo-image';
import { APP_FONTS } from '../../../styles/AppFonts';
import { AppMenu } from '../../lib/Menu';
import { AppIcon } from '../../lib/Icon';
import { AppDivider } from '../../lib/Divider';

import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { APP_BOTTOM_SHEET_ENUM } from '../Core';
import { LinkingUtils } from '../../../utils/linking.utils';

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

function AppBottomSheetLinkPreview() {
	const { theme, stateId, visible, type, appSession } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
			type: o.bottomSheet.type,
			visible: o.bottomSheet.visible,
			stateId: o.bottomSheet.stateId,
			appSession: o.appSession,
		})),
	);

	const ValueRef = useRef<string>(null);
	const [OpenGraph, setOpenGraph] = useState(OgDefault);

	const INACTIVE = !visible || type !== APP_BOTTOM_SHEET_ENUM.LINK;

	async function parse() {
		const _url = appSession.storage.getLinkTarget();

		getLinkPreview(_url.url)
			.then((res) => {
				setOpenGraph({
					key: _url.url,
					parsed: true,
					loading: false,
					og: res as any,
				});
			})
			.catch((e) => {
				setOpenGraph({
					key: _url.url,
					parsed: false,
					loading: false,
					og: null,
				});
			})
			.finally(() => {
				ValueRef.current = _url.url;
			});
	}
	useEffect(() => {
		if (INACTIVE) return;
		parse();
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

	const obj = OpenGraphUtil.parseOgObject(OpenGraph.og);

	if (!OpenGraph.loading && !OpenGraph.parsed) {
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
					Failed to parse this URL!
				</Text>
				<AppMenu.Option
					appIconId={
						<AppIcon
							id={'external-link'}
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						/>
					}
					label={'Retry'}
					onPress={parse}
				/>
				<AppMenu.Option
					appIconId={
						<AppIcon
							id={'external-link'}
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						/>
					}
					label={'Copy Link'}
					onPress={() => {}}
				/>
				<AppMenu.Option
					appIconId={
						<AppIcon id={'browser'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
					}
					label={'Open in Browser'}
					onPress={() => {
						LinkingUtils.openURL(ValueRef.current);
					}}
					desc={'External browser will be used'}
				/>
			</View>
		);
	}

	let _url = ValueRef.current;
	_url = _url?.replace(/(https:\/\/)(.+)/, '$2');
	_url = _url?.replace(/(www\.)(.+)/, _url);

	return (
		<ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
			<View>
				{obj.image && (
					<View
						style={{
							width: '100%',
							justifyContent: 'center',
							minHeight: 172,
							backgroundColor: 'red',
							borderRadius: 16,
						}}
					>
						{/*@ts-ignore-next-line*/}
						<Image
							source={{
								uri: obj.image,
							}}
							cachePolicy={'none'}
							contentFit={'cover'}
							style={{
								margin: 'auto',
								width: '100%',
								minHeight: 172,
								borderTopLeftRadius: 16,
								borderTopRightRadius: 16,
							}}
						/>
					</View>
				)}

				<View style={{ paddingHorizontal: 12, marginTop: 16 }}>
					<ReadMoreText
						text={domain}
						maxLines={1}
						textStyle={{
							color: theme.textColor.medium,
							fontSize: 16,
							fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
						}}
					/>
					<ReadMoreText
						text={obj.title}
						maxLines={1}
						textStyle={{
							color: theme.textColor.high,
							fontSize: 20,
							fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
							marginTop: 8,
						}}
					/>
					<ReadMoreText
						text={obj.desc}
						maxLines={2}
						textStyle={{
							color: theme.textColor.medium,
							fontSize: 16,
							marginTop: 4,
						}}
					/>
				</View>
			</View>
			<AppDivider.Hard
				style={{ marginVertical: 8, marginTop: 16, marginHorizontal: 10 }}
			/>
			<View>
				<AppMenu.Option
					appIconId={
						<AppIcon id={'eye'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
					}
					label={'Show All Content'}
					onPress={() => {}}
					desc={'If title or description text is too long'}
				/>
				<AppMenu.Option
					appIconId={
						<AppIcon id={'copy'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
					}
					label={'Copy Link'}
					onPress={() => {}}
				/>
				<AppMenu.Option
					appIconId={
						<AppIcon
							id={'language'}
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						/>
					}
					label={'Translate'}
					onPress={() => {}}
				/>
				<AppMenu.Option
					appIconId={
						<AppIcon id={'browser'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
					}
					label={'Open in Browser'}
					onPress={() => {
						console.log('pressed...');
						LinkingUtils.openURL(ValueRef.current);
					}}
					desc={'External browser will be used'}
				/>
			</View>
		</ScrollView>
	);
}

export default AppBottomSheetLinkPreview;
