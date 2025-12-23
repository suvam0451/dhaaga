import { UseQueryResult } from '@tanstack/react-query';
import type { NotificationObjectType, ResultPage } from '@dhaaga/bridge';
import useNotificationStore from '#/features/inbox/interactors/useNotificationStore';
import { useEffect, useState } from 'react';
import NavBar_Inbox from '#/features/navbar/views/NavBar_Inbox';
import { TimelineLoadingIndicator } from '#/ui/LoadingIndicator';
import { appDimensions } from '#/styles/dimensions';
import useScrollHandleFlatList from '#/hooks/anim/useScrollHandleFlatList';
import { AppDividerSoft } from '#/ui/Divider';
import TimelineStateIndicator from '#/features/timelines/components/TimelineStateIndicator';
import { LegendList } from '@legendapp/list';

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
			<LegendList
				onScroll={scrollHandler}
				keyExtractor={(item) => item.id}
				recycleItems={true}
				maintainVisibleContentPosition
				onLayout={onLayout}
				data={state.items}
				renderItem={({ item }) => <Wrapper item={item} />}
				onRefresh={_onRefresh}
				refreshing={IsRefreshing}
				// progressViewOffset={appDimensions.topNavbar.hubVariantHeight}
				contentContainerStyle={{
					paddingBottom: appDimensions.lists.paddingBottom,
					paddingTop: appDimensions.topNavbar.hubVariantHeight + 12,
				}}
				ListEmptyComponent={() => (
					<TimelineStateIndicator
						numItems={state.items.length}
						containerHeight={ContainerHeight}
						queryResult={queryResult}
						itemType={'mention'}
					/>
				)}
				ItemSeparatorComponent={() => (
					<AppDividerSoft themed style={{ marginVertical: 4 }} />
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
