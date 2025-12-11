import { ScrollView, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useApiGetTagInterface } from '#/hooks/api/useTags';
import { ActivityPubService } from '@dhaaga/bridge';
import { AppText } from '../../lib/Text';
import {
	useAppApiClient,
	useAppBottomSheet,
	useAppTheme,
} from '#/states/global/hooks';
import BottomSheetActionMenuBuilder from '#/ui/BottomSheetActionMenuBuilder';
import BottomSheetMenu from '#/components/dhaaga-bottom-sheet/components/BottomSheetMenu';

function ABS_TagDetails() {
	const [TagName, setTagName] = useState(null);
	const { theme } = useAppTheme();
	const { stateId, ctx } = useAppBottomSheet();
	const { driver } = useAppApiClient();

	const ValueRef = useRef<string>(null);
	useEffect(() => {
		const _target = ctx?.tag;

		if (ValueRef.current === _target) return;
		setTagName(_target);
		ValueRef.current = _target;
	}, [stateId, ctx]);

	const FOLLOW_POSSIBLE = ActivityPubService.mastodonLike(driver);

	const { data } = useApiGetTagInterface(TagName);

	return (
		<ScrollView>
			<BottomSheetMenu
				title={'N/A'}
				variant={'raised'}
				CustomHeader={
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'flex-end',
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
							{data?.getName() ?? TagName}
						</AppText.Medium>
					</View>
				}
			/>
			<BottomSheetActionMenuBuilder
				items={[
					FOLLOW_POSSIBLE
						? {
								appIconId: 'eye',
								label: 'Follow Tag',
								onPress: () => {},
							}
						: null,
					{
						appIconId: 'eye',
						label: 'Browse Timeline',
						onPress: () => {},
						description: 'Browse posts using this tag',
					},
					{
						appIconId: 'pin',
						label: 'Pin to Social Hub',
						onPress: () => {},
						description: 'Pin this tag to your Hub profile',
					},
				]}
			/>
		</ScrollView>
	);
}

export default ABS_TagDetails;
