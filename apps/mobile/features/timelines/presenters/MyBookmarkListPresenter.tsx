import {
	PostTimelineCtx,
	PostTimelineStateAction,
	TimelineFetchMode,
	usePostTimelineDispatch,
	usePostTimelineState,
} from '@dhaaga/core';
import useTimeline from '../api/useTimeline';
import { useEffect } from 'react';
import { feedUnifiedQueryOptions } from '@dhaaga/react';
import {
	useAppAcct,
	useAppApiClient,
	useAppTheme,
} from '#/hooks/utility/global-state-extractors';
import { useQuery } from '@tanstack/react-query';
import WithAppStatusItemContext from '#/components/containers/contexts/WithPostItemContext';
import StatusItem from '#/components/common/status/StatusItem';
import { appDimensions } from '#/styles/dimensions';
import { TimelineLoadingIndicator } from '#/ui/LoadingIndicator';
import { AnimatedFlashList } from '@shopify/flash-list';
import { RefreshControl } from 'react-native';
import NavBar_Simple from '#/components/shared/topnavbar/NavBar_Simple';
import useHideTopNavUsingFlashList from '#/hooks/anim/useHideTopNavUsingFlashList';
import { countEmojisInBodyContent } from '@dhaaga/bridge/post-process';
import { TimelineFilter_EmojiCrash } from '#/components/common/status/TimelineFilter_EmojiCrash';

function DataView() {
	const { client, driver, server } = useAppApiClient();
	const { acct } = useAppAcct();
	const { theme } = useAppTheme();

	const { refresh, refreshing, onScroll, translateY } = useTimeline(
		TimelineFetchMode.BOOKMARKS,
	);
	const State = usePostTimelineState()!;
	const dispatch = usePostTimelineDispatch()!;

	useEffect(() => {
		dispatch({
			type: PostTimelineStateAction.RESET,
		});
	}, []);

	const { fetchStatus, data, status, refetch, error, isFetched } = useQuery(
		feedUnifiedQueryOptions(client, driver, server, acct.identifier, {
			type: TimelineFetchMode.BOOKMARKS,
			maxId: State.appliedMaxId,
			sessionId: State.sessionId,
		}),
	);

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;
		dispatch({
			type: PostTimelineStateAction.APPEND_RESULTS,
			payload: { ...data, items: countEmojisInBodyContent(data.items) },
		});
	}, [fetchStatus]);

	function onRefresh() {
		dispatch({
			type: PostTimelineStateAction.RESET,
		});
		refetch();
	}

	function loadMore() {
		dispatch({
			type: PostTimelineStateAction.REQUEST_LOAD_MORE,
		});
	}
	function onEndReached() {
		if (State.items.length > 0 && fetchStatus !== 'fetching' && !refreshing) {
			loadMore();
		}
	}

	const { scrollHandler, animatedStyle } =
		useHideTopNavUsingFlashList(onEndReached);

	return (
		<>
			<NavBar_Simple label={'My Bookmarks'} animatedStyle={animatedStyle} />
			<AnimatedFlashList
				data={State.items}
				renderItem={({ item }) => (
					<WithAppStatusItemContext dto={item}>
						<TimelineFilter_EmojiCrash>
							<StatusItem />
						</TimelineFilter_EmojiCrash>
					</WithAppStatusItemContext>
				)}
				onScroll={scrollHandler}
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 4,
				}}
				scrollEventThrottle={16}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
				style={{ backgroundColor: theme.background.a0 }}
			/>
			<TimelineLoadingIndicator networkFetchStatus={fetchStatus} />
		</>
	);
}

function MyBookmarkListPresenter() {
	return (
		<PostTimelineCtx>
			<DataView />
		</PostTimelineCtx>
	);
}

export default MyBookmarkListPresenter;
