import useGlobalState, { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { ScrollView, View } from 'react-native';
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

	useEffect(() => {
		if (INACTIVE) return;

		const _url = appSession.cache.getLinkTarget();
		if (ValueRef.current === _url.url) return;

		setOpenGraph({
			key: _url.url,
			parsed: false,
			loading: true,
			og: null,
		});

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

	console.log(OpenGraph);

	if (INACTIVE) return <View />;

	if (OpenGraph.loading) {
		return (
			<View>
				<AppLoadingIndicator text={'Loading Preview'} />
			</View>
		);
	}

	if (!OpenGraph.loading && !OpenGraph.parsed) {
		return (
			<View>
				<AppLoadingIndicator text={'Failed to Parse'} />
			</View>
		);
	}

	const obj = OpenGraphUtil.parseOgObject(OpenGraph.og);
	console.log(obj);

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
								backgroundColor: 'blue',
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
					Icon={<AppIcon id={'eye'} emphasis={'high'} />}
					label={'Show All Content'}
					onClick={() => {}}
					desc={'If title or description text is too long'}
				/>
				<AppMenu.Option
					Icon={<AppIcon id={'external-link'} emphasis={'high'} />}
					label={'Copy Link'}
					onClick={() => {}}
				/>
				<AppMenu.Option
					Icon={<AppIcon id={'language'} emphasis={'high'} />}
					label={'Translate'}
					onClick={() => {}}
				/>
				<AppMenu.Option
					Icon={<AppIcon id={'external-link'} emphasis={'high'} />}
					label={'Open in Browser'}
					onClick={() => {}}
					desc={'External browser will be used'}
				/>
			</View>
		</ScrollView>
	);
}

export default AppBottomSheetLinkPreview;
