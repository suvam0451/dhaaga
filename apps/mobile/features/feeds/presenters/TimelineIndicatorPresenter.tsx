import useApiGetFeedDetails from '../../timelines/features/controller/interactors/useApiGetFeedDetails';
import { View } from 'react-native';
import { AppIcon } from '#/components/lib/Icon';
import { useAppTheme } from '#/states/global/hooks';
import type { FeedObjectType } from '@dhaaga/bridge';

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

	if (!isFetched || error) return <View />;

	return data?.subscribed ? (
		<AppIcon
			id={'checkmark-circle'}
			size={32}
			color={theme.primary}
			containerStyle={{ padding: 6 }}
		/>
	) : (
		<View />
	);
}

export default TimelineIndicatorPresenter;
