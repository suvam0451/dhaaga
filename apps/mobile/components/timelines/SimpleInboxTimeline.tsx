import { UseQueryResult } from '@tanstack/react-query';
import type { NotificationObjectType, ResultPage } from '@dhaaga/bridge';
import useNotificationStore from '#/features/inbox/interactors/useNotificationStore';
import { useEffect, useState } from 'react';
import NavBar_Inbox from '#/components/topnavbar/NavBar_Inbox';
import { MentionListStateIndicator } from '#/features/inbox/components/MentionListStateIndicator';
import { TimelineLoadingIndicator } from '#/ui/LoadingIndicator';
import { FlatList, RefreshControl } from 'react-native';
import { AppDivider } from '#/components/lib/Divider';
import { appDimensions } from '#/styles/dimensions';
import useScrollHandleFlatList from '#/hooks/anim/useScrollHandleFlatList';

type Props = {
	queryResult: UseQueryResult<ResultPage<NotificationObjectType[]>, Error>;
	Wrapper: ({ item }: { item: NotificationObjectType }) => any;
	type: 'mentions' | 'chats' | 'social' | 'updates' | 'replies';
	label: string;
};

function SimpleInboxTimeline({ queryResult, type, label, Wrapper }: Props) {
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

	const { scrollHandler, animatedStyle } = useScrollHandleFlatList();

	return (
		<>
			<NavBar_Inbox label={label} type={type} animatedStyle={animatedStyle} />
			<FlatList
				onScroll={scrollHandler}
				onLayout={onLayout}
				data={state.items}
				renderItem={({ item }) => <Wrapper item={item} />}
				refreshControl={
					<RefreshControl refreshing={IsRefreshing} onRefresh={_onRefresh} />
				}
				progressViewOffset={appDimensions.topNavbar.hubVariantHeight}
				contentContainerStyle={{
					paddingBottom: appDimensions.lists.paddingBottom,
					paddingTop: appDimensions.topNavbar.hubVariantHeight + 12,
				}}
				ListEmptyComponent={
					<MentionListStateIndicator
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
