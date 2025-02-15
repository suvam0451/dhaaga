import { AppFeedObject } from '../../../types/app-feed.types';
import useApiGetFeedDetails from '../../timelines/features/controller/interactors/useApiGetFeedDetails';
import { View } from 'react-native';
import { AppIcon } from '../../../components/lib/Icon';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';

type Props = {
	item: AppFeedObject;
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
			color={theme.primary.a0}
			containerStyle={{ padding: 6 }}
			onPress={() => {}}
		/>
	) : (
		<AppIcon
			id={'add'}
			size={32}
			color={theme.secondary.a20}
			containerStyle={{ padding: 6 }}
			onPress={() => {}}
		/>
	);
}

export default TimelineIndicatorPresenter;
