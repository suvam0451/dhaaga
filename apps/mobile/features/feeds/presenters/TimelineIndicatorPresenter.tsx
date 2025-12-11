import useApiGetFeedDetails from '../../timelines/features/controller/interactors/useApiGetFeedDetails';
import { View } from 'react-native';
import { AppIcon } from '#/components/lib/Icon';
import { useAppBottomSheet, useAppTheme } from '#/states/global/hooks';
import type { FeedObjectType } from '@dhaaga/bridge';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';

type Props = {
	item: FeedObjectType;
};

/**
 * Shows a plus sign, if not followed
 * and a plus button if followed
 * @constructor
 */
function TimelineIndicatorPresenter({ item }: Props) {
	const { data, isFetched, error } = useApiGetFeedDetails(item.uri);
	const { theme } = useAppTheme();
	const { setCtx, show } = useAppBottomSheet();

	if (!isFetched || error) return <View />;

	function onMoreOptionsPressed() {
		setCtx({
			feedUri: item.uri,
			feed: item,
		});
		show(APP_BOTTOM_SHEET_ENUM.MORE_FEED_ACTIONS, true);
	}

	return data?.subscribed ? (
		<AppIcon
			id={'checkmark-circle'}
			size={32}
			color={theme.primary}
			containerStyle={{ padding: 6 }}
			onPress={onMoreOptionsPressed}
		/>
	) : (
		<AppIcon
			id={'add'}
			size={32}
			color={theme.secondary.a20}
			containerStyle={{ padding: 6 }}
			onPress={onMoreOptionsPressed}
		/>
	);
}

export default TimelineIndicatorPresenter;
