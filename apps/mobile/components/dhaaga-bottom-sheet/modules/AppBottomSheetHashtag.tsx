import { ScrollView, Text, View } from 'react-native';
import useGlobalState, { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { useEffect, useRef, useState } from 'react';
import { useTag } from '../../../hooks/api/tags/useTag';
import { APP_FONTS } from '../../../styles/AppFonts';
import { AppDivider } from '../../lib/Divider';
import { AppMenu } from '../../lib/Menu';
import { AppIcon } from '../../lib/Icon';
import ActivityPubService from '../../../services/activitypub.service';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';

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

	const FOLLOW_POSSIBLE =
		ActivityPubService.mastodonLike(driver) ||
		ActivityPubService.blueskyLike(driver);

	const { data } = useTag(TagName);

	if (INACTIVE) return <View />;
	return (
		<ScrollView contentContainerStyle={{ paddingBottom: 32, paddingTop: 40 }}>
			<View
				style={{
					marginLeft: 12,
					flexDirection: 'row',
				}}
			>
				<Text
					style={{
						fontSize: 20,
						fontFamily: APP_FONTS.INTER_700_BOLD,
						color: theme.textColor.high,
						flex: 1,
					}}
					numberOfLines={1}
				>
					<Text
						style={{
							fontSize: 20,
							fontFamily: APP_FONTS.INTER_400_REGULAR,
							color: theme.textColor.medium,
							flexShrink: 1,
						}}
					>
						#
					</Text>
					{data?.getName()}
				</Text>
			</View>
			<AppDivider.Hard
				style={{ marginVertical: 8, marginTop: 16, marginHorizontal: 10 }}
			/>
			<View style={{ paddingHorizontal: 12 }}>
				{FOLLOW_POSSIBLE && (
					<AppMenu.Option
						Icon={
							<AppIcon id={'eye'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
						}
						label={'Follow Tag'}
						onClick={() => {}}
					/>
				)}
				<AppMenu.Option
					Icon={
						<AppIcon id={'eye'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
					}
					label={'Preview'}
					onClick={() => {}}
					desc={'Quickly view posts using this tag'}
				/>

				<AppMenu.Option
					Icon={
						<AppIcon id={'pin'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
					}
					label={'Pin to Social Hub'}
					onClick={() => {}}
					desc={'Pin this to your Social Hub'}
				/>
				<AppMenu.Option
					Icon={
						<AppIcon
							id={'language'}
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						/>
					}
					label={'Explain'}
					desc={'Explains the meaning of this word'}
					onClick={() => {}}
				/>

				<AppMenu.Option
					Icon={
						<AppIcon id={'eye'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
					}
					label={'Open Timeline'}
					onClick={() => {}}
					desc={'Navigate and view posts using this tag.'}
				/>
			</View>
		</ScrollView>
	);
}

export default AppBottomSheetHashtag;
