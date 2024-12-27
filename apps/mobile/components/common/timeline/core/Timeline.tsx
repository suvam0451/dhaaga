import {
	createContext,
	memo,
	MutableRefObject,
	useContext,
	useEffect,
	useReducer,
	useRef,
} from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import TimelinesHeader from '../../../shared/topnavbar/fragments/TopNavbarTimelineStack';
import LoadingMore from '../../../screens/home/LoadingMore';
import useLoadingMoreIndicatorState from '../../../../states/useLoadingMoreIndicatorState';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import Introduction from '../../../tutorials/screens/home/new-user/Introduction';
import WithTimelineControllerContext from '../api/useTimelineController';
import usePageRefreshIndicatorState from '../../../../states/usePageRefreshIndicatorState';
import useTimeline from '../api/useTimeline';
import WithAppTimelineDataContext from '../../../../hooks/app/timelines/useAppTimelinePosts';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import { AppBskyFeedGetTimeline } from '@atproto/api';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { AppFlashList } from '../../../../components/lib/AppFlashList';
import { useLocalSearchParams } from 'expo-router';
import UserPeekModal from '../../../modals/UserPeekModal';
import {
	appTimelineReducer,
	AppTimelineReducerActionType,
	appTimelineReducerDefault,
	AppTimelineReducerDispatchType,
	AppTimelineReducerStateType,
	TimelineFetchMode,
} from '../../../../states/reducers/timeline.reducer';
import { PostMiddleware } from '../../../../services/middlewares/post.middleware';
import { TimelineSessionService } from '../../../../services/session/timeline-session.service';

/**
 * --- Context Setup ---
 */

const _StateCtx = createContext<AppTimelineReducerStateType>(null);
const _DispatchCtx = createContext<AppTimelineReducerDispatchType>(null);
const _ManagerCtx =
	createContext<MutableRefObject<TimelineSessionService>>(null);

// exports
export const useTimelineState = () => useContext(_StateCtx);
export const useTimelineDispatch = () => useContext(_DispatchCtx);
export const useTimelineManager = () => useContext(_ManagerCtx);

/*
 * Render a Timeline
 */
const Timeline = memo(() => {
	const { db } = useGlobalState(
		useShallow((o) => ({
			db: o.db,
		})),
	);

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

	const { client, driver, acct } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			client: o.router,
			driver: o.driver,
		})),
	);

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
		dispatch({
			type: AppTimelineReducerActionType.APPEND_RESULTS,
			payload: {
				items: PostMiddleware.deserialize<unknown[]>(
					nextBatch,
					driver,
					acct?.server,
				),
				maxId,
			},
		});
	}, [fetchStatus]);

	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

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
	const { onRefresh, refreshing } = usePageRefreshIndicatorState({
		fetchStatus,
		refetch,
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
				refreshing={refreshing}
				onRefresh={onRefresh}
				paddingTop={50 + 16}
			/>
			<LoadingMore visible={visible} loading={loading} />
		</View>
	);
});

/**
 * --- Context Wrapper ---
 */

function CtxWrapper({ children }) {
	const { driver, client } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
			client: o.router,
		})),
	);
	const [state, dispatch] = useReducer(
		appTimelineReducer,
		appTimelineReducerDefault,
	);

	const manager = useRef<TimelineSessionService>(null);
	useEffect(() => {
		manager.current = new TimelineSessionService(driver, client, dispatch);
	}, [driver, client, dispatch]);

	return (
		<_StateCtx.Provider value={state}>
			<_DispatchCtx.Provider value={dispatch}>
				<_ManagerCtx.Provider value={manager}>{children}</_ManagerCtx.Provider>
			</_DispatchCtx.Provider>
		</_StateCtx.Provider>
	);
}

function TimelineWrapper() {
	return (
		<WithTimelineControllerContext>
			<CtxWrapper>
				<WithAppTimelineDataContext>
					<Timeline />
					<UserPeekModal />
				</WithAppTimelineDataContext>
			</CtxWrapper>
		</WithTimelineControllerContext>
	);
}

export default TimelineWrapper;

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
