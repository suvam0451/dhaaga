import { useEffect, useState } from 'react';
import { useDiscoverState, UserTimelineCtx } from '@dhaaga/core';
import { useApiSearchUsers } from '#/hooks/api/useApiSearch';
import {
	UserTimelineStateAction,
	useUserTimelineDispatch,
	useUserTimelineState,
} from '@dhaaga/core';
import { FlatList, RefreshControl, View } from 'react-native';
import { TimelineLoadingIndicator } from '#/ui/LoadingIndicator';
import UserListItemDetailedView from '#/features/timelines/view/UserListItemDetailedView';
import useScrollHandleFlatList from '#/hooks/anim/useScrollHandleFlatList';

function Generator() {
	const [Refreshing, setRefreshing] = useState(false);
	const State = useDiscoverState();
	const TimelineState = useUserTimelineState();
	const TimelineDispatch = useUserTimelineDispatch();
	const { data, fetchStatus, refetch } = useApiSearchUsers(
		'suggested',
		State.q,
		TimelineState.appliedMaxId,
	);

	useEffect(() => {
		TimelineDispatch({
			type: UserTimelineStateAction.RESET,
		});
	}, [State.q]);

	function onRefresh() {
		setRefreshing(true);
		TimelineDispatch({
			type: UserTimelineStateAction.RESET,
		});
		refetch().finally(() => {
			setRefreshing(false);
		});
	}

	useEffect(() => {
		if (data.length === 0) return;

		let maxId = (TimelineState.items.length + data.length).toString();
		TimelineDispatch({
			type: UserTimelineStateAction.APPEND,
			payload: {
				data,
				maxId,
				minId: null,
			},
		});
	}, [fetchStatus]);

	function loadMore() {
		TimelineDispatch({
			type: UserTimelineStateAction.REQUEST_LOAD_MORE,
		});
	}

	/**
	 * Composite Hook Collection
	 */
	const { scrollHandler } = useScrollHandleFlatList(loadMore);

	return (
		<View
			style={{
				flex: 1,
			}}
		>
			<FlatList
				data={TimelineState.items}
				renderItem={({ item }) => <UserListItemDetailedView item={item} />}
				onScroll={scrollHandler}
				scrollEventThrottle={16}
				refreshControl={
					<RefreshControl refreshing={Refreshing} onRefresh={onRefresh} />
				}
			/>
			<TimelineLoadingIndicator
				numItems={State.results.users.length}
				networkFetchStatus={fetchStatus}
			/>
		</View>
	);
}

function UserResultView() {
	return (
		<UserTimelineCtx>
			<Generator />
		</UserTimelineCtx>
	);
}

export default UserResultView;
