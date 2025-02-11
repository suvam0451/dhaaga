import { useEffect, useState } from 'react';
import { useDiscoverTabState } from '../contexts/DiscoverTabCtx';
import {
	useUserTimelineDispatch,
	useUserTimelineState,
} from '../../timelines/contexts/UserTimelineCtx';
import { useApiSearchUsers } from '../../../hooks/api/useApiSearch';
import { AppUserTimelineReducerActionType } from '../../../states/interactors/user-timeline.reducer';
import useLoadingMoreIndicatorState from '../../../states/useLoadingMoreIndicatorState';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { View } from 'react-native';
import LoadingMore from '../../../components/screens/home/LoadingMore';
import Header from '../components/Header';
import { UserListView } from '../../_shared/views/UserListView';

type ResultInteractorProps = {
	onDataLoaded: (isEmpty: boolean) => void;
};

function UserResultInteractor({ onDataLoaded }: ResultInteractorProps) {
	const [Refreshing, setRefreshing] = useState(false);
	const State = useDiscoverTabState();
	const TimelineState = useUserTimelineState();
	const TimelineDispatch = useUserTimelineDispatch();
	const { data, fetchStatus, refetch } = useApiSearchUsers(
		State.q,
		TimelineState.appliedMaxId,
	);

	useEffect(() => {
		TimelineDispatch({
			type: AppUserTimelineReducerActionType.RESET,
		});
	}, [State.q]);

	function onRefresh() {
		setRefreshing(true);
		TimelineDispatch({
			type: AppUserTimelineReducerActionType.RESET,
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
		// let maxId = data[data.length - 1].id;
		TimelineDispatch({
			type: AppUserTimelineReducerActionType.APPEND_RESULTS,
			payload: {
				items: data,
				maxId,
			},
		});
	}, [fetchStatus]);

	function loadMore() {
		TimelineDispatch({
			type: AppUserTimelineReducerActionType.REQUEST_LOAD_MORE,
		});
	}

	/**
	 * Composite Hook Collection
	 */
	const { visible, loading } = useLoadingMoreIndicatorState({
		fetchStatus,
	});
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
			<LoadingMore visible={visible} loading={loading} />
		</View>
	);
}

export default UserResultInteractor;
