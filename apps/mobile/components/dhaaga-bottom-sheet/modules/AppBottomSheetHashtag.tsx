import { ScrollView, View } from 'react-native';
import { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';
import { useEffect, useRef, useState } from 'react';
import { useApiGetTagInterface } from '../../../hooks/api/useTags';
import { AppMenu } from '../../lib/Menu';
import { AppIcon } from '../../lib/Icon';
import { ActivityPubService } from '@dhaaga/bridge';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { AppText } from '../../lib/Text';
import {
	useAppApiClient,
	useAppBottomSheet,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { appDimensions } from '../../../styles/dimensions';

function AppBottomSheetHashtag() {
	const [TagName, setTagName] = useState(null);
	const { theme } = useAppTheme();
	const { type, visible, stateId, ctx } = useAppBottomSheet();
	const { driver } = useAppApiClient();

	const INACTIVE = !visible || type !== APP_BOTTOM_SHEET_ENUM.HASHTAG;

	const ValueRef = useRef<string>(null);
	useEffect(() => {
		const _target = ctx?.tag;

		if (ValueRef.current === _target) return;
		setTagName(_target);
		ValueRef.current = _target;
	}, [stateId, ctx]);

	const FOLLOW_POSSIBLE = ActivityPubService.mastodonLike(driver);

	const { data } = useApiGetTagInterface(TagName);

	if (INACTIVE) return <View />;
	return (
		<ScrollView>
			<View
				style={{
					paddingLeft: 12,
					flexDirection: 'row',
					alignItems: 'flex-end',
					backgroundColor: theme.background.a30,
					paddingTop: appDimensions.bottomSheet.clearanceTop + 8,
					borderTopLeftRadius: appDimensions.bottomSheet.borderRadius,
					borderTopRightRadius: appDimensions.bottomSheet.borderRadius,
					paddingBottom: 16,
				}}
			>
				<AppText.Normal
					style={{
						fontSize: 16,
						color: theme.secondary.a40,
						flexShrink: 1,
					}}
				>
					#
				</AppText.Normal>
				<AppText.Medium
					style={{ fontSize: 20, marginLeft: 3, color: theme.primary.a0 }}
				>
					{data?.getName()}
				</AppText.Medium>
			</View>
			<View style={{ paddingHorizontal: 12, marginTop: 12 }}>
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
					label={'Browse Timeline'}
					onPress={() => {}}
					desc={'Browse posts using this tag'}
				/>
				<AppMenu.Option
					appIconId={
						<AppIcon id={'pin'} emphasis={APP_COLOR_PALETTE_EMPHASIS.A10} />
					}
					label={'Pin to Social Hub'}
					onPress={() => {}}
					desc={'Pin this tag to your Hub profile'}
				/>
			</View>
		</ScrollView>
	);
}

export default AppBottomSheetHashtag;
