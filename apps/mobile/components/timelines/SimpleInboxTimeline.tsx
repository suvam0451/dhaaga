import { UseQueryResult } from '@tanstack/react-query';
import type { NotificationObjectType, ResultPage } from '@dhaaga/bridge';
import useNotificationStore from '#/features/inbox/interactors/useNotificationStore';
import { useEffect, useState } from 'react';
import Header from '#/features/inbox/components/Header';
import { APP_LANDING_PAGE_TYPE } from '#/components/shared/topnavbar/AppTabLandingNavbar';
import { StateIndicator } from '#/features/inbox/components/StateIndicator';
import { TimelineLoadingIndicator } from '#/ui/LoadingIndicator';
import { FlatList, RefreshControl } from 'react-native';
import { AppDivider } from '#/components/lib/Divider';

type Props = {
	queryResult: UseQueryResult<ResultPage<NotificationObjectType[]>, Error>;
	Wrapper: ({ item }: { item: NotificationObjectType }) => any;
};

function SimpleInboxTimeline({ queryResult, Wrapper }: Props) {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { state, loadNext, append, reset } = useNotificationStore();
	const { data, refetch, isPending, fetchStatus, error } = queryResult;

	useEffect(() => {
		if (fetchStatus !== 'fetching' && !error) append(data);
	}, [fetchStatus]);

	async function refresh() {
		reset();
		await refetch();
	}

	const [ContainerHeight, setContainerHeight] = useState(0);
	function onLayout(event: any) {
		setContainerHeight(event.nativeEvent.layout.height);
	}

	function _onRefresh() {
		setIsRefreshing(true);
		refresh().finally(() => {
			setIsRefreshing(false);
		});
	}

	return (
		<>
			<FlatList
				onLayout={onLayout}
				data={state.items}
				renderItem={({ item }) => <Wrapper item={item} />}
				ListHeaderComponent={<Header type={APP_LANDING_PAGE_TYPE.MENTIONS} />}
				refreshControl={
					<RefreshControl refreshing={IsRefreshing} onRefresh={_onRefresh} />
				}
				contentContainerStyle={{
					paddingBottom: 32,
				}}
				ListEmptyComponent={
					<StateIndicator
						numItems={state.items.length}
						containerHeight={ContainerHeight}
						queryResult={queryResult}
					/>
				}
				ItemSeparatorComponent={() => (
					<AppDivider.Soft style={{ marginVertical: 12 }} />
				)}
				onEndReached={() => {
					if (!isPending) loadNext();
				}}
				style={{ zIndex: 1 }}
			/>
			<TimelineLoadingIndicator
				numItems={state.items.length}
				networkFetchStatus={fetchStatus}
				style={{ bottom: 48 }}
			/>
		</>
	);
}

export default SimpleInboxTimeline;
