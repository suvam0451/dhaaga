import { View } from 'react-native';
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
		if (ctx.$type !== 'tag-preview') return setTagName(null);
		if (ValueRef.current === ctx.tagId) return;
		setTagName(ctx.tagId);
		ValueRef.current = ctx.tagId;
	}, [stateId]);

	const FOLLOW_POSSIBLE = ActivityPubService.mastodonLike(driver);

	const { data } = useApiGetTagInterface(TagName);

	const BASE_ACTIONS = [
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
	];

	if (FOLLOW_POSSIBLE) {
		BASE_ACTIONS.unshift({
			appIconId: 'eye',
			label: 'Follow Tag',
			description: 'follow this tag',
			onPress: () => {},
		});
	}

	return (
		<>
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
							style={{ fontSize: 20, marginLeft: 3, color: theme.primary }}
						>
							{data?.getName() ?? TagName}
						</AppText.Medium>
					</View>
				}
			/>
			<BottomSheetActionMenuBuilder items={BASE_ACTIONS} />
		</>
	);
}

export default ABS_TagDetails;
