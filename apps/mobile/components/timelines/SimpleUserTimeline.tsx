import type { UserObjectType } from '@dhaaga/bridge';
import { SimpleTimelineProps } from '#/components/timelines/shared';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import {
	UserTimelineStateAction,
	useUserTimelineDispatch,
	useUserTimelineState,
} from '@dhaaga/core';
import { useEffect, useState } from 'react';
import useScrollHandleFlatList from '#/hooks/anim/useScrollHandleFlatList';
import NavBar_Simple from '#/components/shared/topnavbar/NavBar_Simple';
import { FlatList, RefreshControl } from 'react-native';
import { appDimensions } from '#/styles/dimensions';
import UserListItemView from '#/features/timelines/view/UserListItemView';

function SimpleUserTimeline({
	timelineLabel,
	queryResult,
	skipTimelineInit,
}: SimpleTimelineProps<UserObjectType[]>) {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { theme } = useAppTheme();
	const State = useUserTimelineState();
	const dispatch = useUserTimelineDispatch();

	useEffect(() => {
		if (skipTimelineInit) return;
		dispatch({
			type: UserTimelineStateAction.RESET,
		});
	}, []);

	const { fetchStatus, data, status, refetch } = queryResult;

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;
		dispatch({
			type: UserTimelineStateAction.APPEND,
			payload: data,
		});
	}, [fetchStatus]);

	function onRefresh() {
		setIsRefreshing(true);
		dispatch({
			type: UserTimelineStateAction.RESET,
		});
		refetch().finally(() => setIsRefreshing(false));
	}

	function loadMore() {
		dispatch({
			type: UserTimelineStateAction.REQUEST_LOAD_MORE,
		});
	}

	function onEndReached() {
		if (State.items.length > 0 && fetchStatus !== 'fetching') {
			loadMore();
		}
	}

	const { scrollHandler, animatedStyle } =
		useScrollHandleFlatList(onEndReached);

	/**
	 * NOTE: AT proto does not return a detailed view
	 */
	return (
		<>
			<NavBar_Simple label={timelineLabel} animatedStyle={animatedStyle} />
			<FlatList
				data={State.items}
				renderItem={({ item }) => <UserListItemView item={item} />}
				onScroll={scrollHandler}
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 4,
				}}
				scrollEventThrottle={64}
				refreshControl={
					<RefreshControl refreshing={IsRefreshing} onRefresh={onRefresh} />
				}
				style={{ backgroundColor: theme.background.a0 }}
			/>
		</>
	);
}

export default SimpleUserTimeline;
