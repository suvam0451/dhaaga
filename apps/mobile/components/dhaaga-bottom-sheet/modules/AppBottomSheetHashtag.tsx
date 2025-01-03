import { ScrollView, Text, View } from 'react-native';
import useGlobalState from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { useEffect, useRef, useState } from 'react';
import { useApiGetTagInterface } from '../../../hooks/api/useTags';
import { APP_FONTS } from '../../../styles/AppFonts';
import { AppDivider } from '../../lib/Divider';
import { AppMenu } from '../../lib/Menu';
import { AppIcon } from '../../lib/Icon';
import ActivityPubService from '../../../services/activitypub.service';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { APP_BOTTOM_SHEET_ENUM } from '../Core';
import { AppText } from '../../lib/Text';

function AppBottomSheetHashtag() {
	const [TagName, setTagName] = useState(null);
	const { theme, stateId, visible, type, appSession, driver } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
			type: o.bottomSheet.type,
			visible: o.bottomSheet.visible,
			stateId: o.bottomSheet.stateId,
			appSession: o.appSession,
			driver: o.driver,
		})),
	);

	const INACTIVE = !visible || type !== APP_BOTTOM_SHEET_ENUM.HASHTAG;

	const ValueRef = useRef<string>(null);
	useEffect(() => {
		if (!appSession) return;
		const _tag = appSession.storage.getTagTarget();

		if (ValueRef.current === _tag) return;
		setTagName(_tag);
		ValueRef.current = _tag;
	}, [stateId]);

	const FOLLOW_POSSIBLE = ActivityPubService.mastodonLike(driver);

	const { data } = useApiGetTagInterface(TagName);

	if (INACTIVE) return <View />;
	return (
		<ScrollView contentContainerStyle={{ paddingBottom: 32, paddingTop: 40 }}>
			<View
				style={{
					marginLeft: 12,
					flexDirection: 'row',
					alignItems: 'flex-end',
				}}
			>
				<AppText.Normal
					style={{
						fontSize: 16,
						fontFamily: APP_FONTS.INTER_400_REGULAR,
						color: theme.textColor.medium,
						flexShrink: 1,
					}}
				>
					#
				</AppText.Normal>
				<AppText.Medium style={{ fontSize: 22, marginLeft: 2 }}>
					{data?.getName()}
				</AppText.Medium>
			</View>
			<AppDivider.Hard
				style={{
					marginVertical: 8,
					marginTop: 16,
					marginHorizontal: 10,
					backgroundColor: '#282828',
				}}
			/>
			<View style={{ paddingHorizontal: 12 }}>
				{FOLLOW_POSSIBLE && (
					<AppMenu.Option
						appIconId={
							<AppIcon id={'eye'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
						}
						label={'Follow Tag'}
						onPress={() => {}}
					/>
				)}
				<AppMenu.Option
					appIconId={
						<AppIcon id={'eye'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
					}
					label={'Preview'}
					onPress={() => {}}
					desc={'Preview posts using this tag'}
				/>

				<AppMenu.Option
					appIconId={
						<AppIcon id={'pin'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
					}
					label={'Pin to Social Hub'}
					onPress={() => {}}
					desc={'Pin this tag to your Hub profile'}
				/>
				{/*<AppMenu.Option*/}
				{/*	appIconId={*/}
				{/*		<AppIcon*/}
				{/*			id={'language'}*/}
				{/*			emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}*/}
				{/*		/>*/}
				{/*	}*/}
				{/*	label={'Explain'}*/}
				{/*	desc={'Explains the meaning of this word'}*/}
				{/*	onPress={() => {}}*/}
				{/*/>*/}

				<AppMenu.Option
					appIconId={
						<AppIcon id={'eye'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
					}
					label={'Open Timeline'}
					onPress={() => {}}
					desc={'Browse all posts using this tag'}
				/>
			</View>
		</ScrollView>
	);
}

export default AppBottomSheetHashtag;
