import { useEffect, useState } from 'react';
import { useDiscoverState } from '@dhaaga/core';
import { useApiSearchUsers } from '../../../hooks/api/useApiSearch';
import {
	UserTimelineStateAction,
	useUserTimelineDispatch,
	useUserTimelineState,
} from '@dhaaga/core';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { View } from 'react-native';
import { TimelineLoadingIndicator } from '../../../ui/LoadingIndicator';
import Header from '../components/Header';
import { UserListView } from '../../_shared/views/UserListView';

type ResultInteractorProps = {
	onDataLoaded: (isEmpty: boolean) => void;
};

function UserResultInteractor({ onDataLoaded }: ResultInteractorProps) {
	const [Refreshing, setRefreshing] = useState(false);
	const State = useDiscoverState();
	const TimelineState = useUserTimelineState();
	const TimelineDispatch = useUserTimelineDispatch();
	const { data, fetchStatus, refetch } = useApiSearchUsers(
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
		if (!data) {
			onDataLoaded(true);
			return;
		}
		onDataLoaded(false);

		if (data.length === 0) return;

		let maxId = (TimelineState.items.length + data.length).toString();
		TimelineDispatch({
			type: UserTimelineStateAction.APPEND,
			payload: {
				items: data,
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
	const { onScroll } = useScrollMoreOnPageEnd({
		itemCount: TimelineState.items.length,
		updateQueryCache: loadMore,
	});

	return (
		<View
			style={{
				flex: 1,
			}}
		>
			<UserListView
				items={TimelineState.items}
				onScroll={onScroll}
				onRefresh={onRefresh}
				refreshing={Refreshing}
				ListHeaderComponent={Header}
			/>
			<TimelineLoadingIndicator networkFetchStatus={fetchStatus} />
		</View>
	);
}

export default UserResultInteractor;
