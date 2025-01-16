import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import TimelinesHeader from '../../../shared/topnavbar/fragments/TopNavbarTimelineStack';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import ErrorNoClient from '../../../tutorials/screens/home/new-user/Introduction';
import useTimeline from '../api/useTimeline';
import { useLocalSearchParams } from 'expo-router';
import {
	AppTimelineReducerActionType,
	TimelineFetchMode,
} from '../../../../states/reducers/post-timeline.reducer';
import {
	useAppApiClient,
	useAppDb,
	useAppTheme,
} from '../../../../hooks/utility/global-state-extractors';
import WithPostTimelineCtx, {
	useTimelineDispatch,
	useTimelineState,
} from '../../../context-wrappers/WithPostTimeline';
import { PostTimeline } from '../../../data-views/PostTimeline';

/*
 * Render a Timeline
 */
function DataView() {
	const { db } = useAppDb();
	const { client } = useAppApiClient();

	const State = useTimelineState();
	const dispatch = useTimelineDispatch();

	// reset the timeline on param change
	const params = useLocalSearchParams();
	const pinId: string = params['pinId'] as string;
	const pinType: string = params['pinType'] as string;

	useEffect(() => {
		if (!db) return;
		dispatch({
			type: AppTimelineReducerActionType.INIT,
			payload: {
				db,
			},
		});

		if (!pinType || !pinId) return;
		if (pinId) {
			dispatch({
				type: AppTimelineReducerActionType.RESET_USING_PIN_ID,
				payload: {
					id: parseInt(pinId),
					type: pinType as 'feed' | 'user' | 'tag',
				},
			});
		}
	}, [pinId, pinType, db]);

	useEffect(() => {
		dispatch({
			type: AppTimelineReducerActionType.RESET,
		});
	}, [State.feedType, State.query, State.opts, db]);

	const { fetchStatus, data, status, refetch } = useTimeline({
		type: State.feedType,
		query: State.query,
		opts: State.opts,
		maxId: State.appliedMaxId,
	});

	const [Refreshing, setRefreshing] = useState(false);

	function onRefresh() {
		setRefreshing(true);
		dispatch({
			type: AppTimelineReducerActionType.RESET,
		});
		refetch().finally(() => {
			setRefreshing(false);
		});
	}

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;
		dispatch({
			type: AppTimelineReducerActionType.APPEND_RESULTS,
			payload: data,
		});
	}, [fetchStatus]);

	const { theme } = useAppTheme();

	function loadMore() {
		dispatch({
			type: AppTimelineReducerActionType.REQUEST_LOAD_MORE,
		});
	}

	/**
	 * Composite Hook Collection
	 */
	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: State.items.length,
		updateQueryCache: loadMore,
	});

	if (client === null) return <ErrorNoClient />;
	if (State.feedType === TimelineFetchMode.IDLE) return <View />;

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: theme.palette.bg,
				},
			]}
		>
			<Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
				<TimelinesHeader />
			</Animated.View>
			<PostTimeline
				data={State.items}
				onScroll={onScroll}
				refreshing={Refreshing}
				onRefresh={onRefresh}
				fetchStatus={fetchStatus}
			/>
		</View>
	);
}

function Timeline() {
	return (
		<WithPostTimelineCtx>
			<DataView />
		</WithPostTimelineCtx>
	);
}

export default Timeline;

const styles = StyleSheet.create({
	header: {
		position: 'absolute',
		backgroundColor: '#1c1c1c',
		left: 0,
		right: 0,
		width: '100%',
		zIndex: 1,
	},
	container: {
		flex: 1,
		position: 'relative',
	},
});
