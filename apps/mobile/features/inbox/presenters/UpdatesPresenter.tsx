import { APP_LANDING_PAGE_TYPE } from '../../../components/shared/topnavbar/AppTabLandingNavbar';
import { useApiGetSubscriptionUpdates } from '../../../hooks/api/useNotifications';
import { useEffect, useMemo } from 'react';
import useNotificationStore from '../interactors/useNotificationStore';
import NotificationItemPresenter from './NotificationItemPresenter';
import Header from '../components/Header';
import FlashListService from '../../../services/flashlist.service';
import { ListWithSkeletonPlaceholder } from '../../../ui/Lists';
import { NotificationSkeletonView } from '../components/Skeleton';
import { View } from 'react-native';
import { AppText } from '../../../components/lib/Text';

function UpdatesPresenter() {
	const { state, loadNext, maxId, append, reset } = useNotificationStore();
	const { data, refetch, isPending, fetchStatus, isRefetching } =
		useApiGetSubscriptionUpdates(maxId);

	useEffect(() => {
		if (fetchStatus !== 'fetching') {
			append(data);
		}
	}, [fetchStatus]);

	async function refresh() {
		reset();
		await refetch();
	}

	const listItems = useMemo(() => {
		return FlashListService.notifications(state.items);
	}, [state.items]);

	const IS_LOADING = listItems.length === 0 && (isPending || isRefetching);

	return (
		<ListWithSkeletonPlaceholder
			SkeletonView={NotificationSkeletonView}
			ItemView={(item) => <NotificationItemPresenter item={item} />}
			items={listItems}
			isLoading={IS_LOADING}
			onEndReached={() => {
				if (!isPending) loadNext();
			}}
			SkeletonEstimatedHeight={136}
			ListHeaderComponent={<Header type={APP_LANDING_PAGE_TYPE.UPDATES} />}
			onRefresh={refresh}
			listEmpty={state.listEmpty}
			ListEmptyComponent={
				<View>
					<AppText.Normal>Notification List Empty</AppText.Normal>
				</View>
			}
		/>
	);
}

export default UpdatesPresenter;
