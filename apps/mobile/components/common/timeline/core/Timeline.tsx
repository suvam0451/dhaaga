import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import TimelinesHeader from '../../../shared/topnavbar/fragments/TopNavbarTimelineStack';
import LoadingMore from '../../../screens/home/LoadingMore';
import useLoadingMoreIndicatorState from '../../../../states/useLoadingMoreIndicatorState';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import Introduction from '../../../tutorials/screens/home/new-user/Introduction';
import useTimeline from '../api/useTimeline';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { AppBskyFeedGetTimeline } from '@atproto/api';
import { AppFlashList } from '../../../../components/lib/AppFlashList';
import { useLocalSearchParams } from 'expo-router';
import {
	AppTimelineReducerActionType,
	TimelineFetchMode,
} from '../../../../states/reducers/post-timeline.reducer';
import { PostMiddleware } from '../../../../services/middlewares/post.middleware';
import {
	useAppAcct,
	useAppApiClient,
	useAppDb,
	useAppTheme,
} from '../../../../hooks/utility/global-state-extractors';
import WithPostTimelineCtx, {
	useTimelineDispatch,
	useTimelineState,
} from '../../../context-wrappers/WithPostTimeline';
import UserPeekModal from '../../../modals/UserPeekModal';

/*
 * Render a Timeline
 */
function Base() {
	const { db } = useAppDb();
	const { client, driver } = useAppApiClient();
	const { acct } = useAppAcct();

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
	}, [State.feedType, State.query, State.opts]);

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

		let maxId = null;
		let nextBatch = [];

		if (driver === KNOWN_SOFTWARE.BLUESKY) {
			const _payload = data as unknown as AppBskyFeedGetTimeline.Response;
			maxId = _payload.data.cursor;
			nextBatch = _payload.data.feed;
		} else {
			maxId = data[data.length - 1]?.id;
			nextBatch = data;
		}
		const retval = PostMiddleware.deserialize<unknown[]>(
			nextBatch,
			driver,
			acct?.server,
		);
		dispatch({
			type: AppTimelineReducerActionType.APPEND_RESULTS,
			payload: {
				items: retval,
				maxId,
			},
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
	const { visible, loading } = useLoadingMoreIndicatorState({
		fetchStatus,
	});
	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: State.items.length,
		updateQueryCache: loadMore,
	});

	if (client === null) return <Introduction />;
	if (State.feedType === TimelineFetchMode.IDLE) {
		return <View />;
	}

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
			<AppFlashList.Post
				data={State.items}
				onScroll={onScroll}
				refreshing={Refreshing}
				onRefresh={onRefresh}
				paddingTop={50 + 16}
			/>
			<LoadingMore visible={visible} loading={loading} />
			<UserPeekModal />
		</View>
	);
}

function Timeline() {
	return (
		<WithPostTimelineCtx>
			<Base />
		</WithPostTimelineCtx>
	);
}

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

export default Timeline;
