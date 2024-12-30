import { useEffect, useMemo, useState } from 'react';
import useScrollMoreOnPageEnd from '../../../../../../states/useScrollMoreOnPageEnd';
import LoadingMore from '../../../../home/LoadingMore';
import useLoadingMoreIndicatorState from '../../../../../../states/useLoadingMoreIndicatorState';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { StyleSheet, Text, View } from 'react-native';
import {
	useAppApiClient,
	useAppTheme,
} from '../../../../../../hooks/utility/global-state-extractors';
import {
	APP_SEARCH_TYPE,
	DiscoverTabReducerActionType,
} from '../../../../../../states/reducers/discover-tab.reducer';
import WithPostTimelineCtx, {
	useTimelineDispatch,
	useTimelineState,
} from '../../../../../context-wrappers/WithPostTimeline';
import { AppFlashList } from '../../../../../lib/AppFlashList';
import { AppTimelineReducerActionType } from '../../../../../../states/reducers/post-timeline.reducer';
import {
	useApiSearchPosts,
	useApiSearchUsers,
} from '../../../../../../hooks/api/useApiSearch';
import { APP_FONTS } from '../../../../../../styles/AppFonts';
import {
	useDiscoverTabDispatch,
	useDiscoverTabState,
} from '../../../../../context-wrappers/WithDiscoverTabCtx';
import WithUserTimelineCtx, {
	useUserTimelineDispatch,
	useUserTimelineState,
} from '../../../../../context-wrappers/WithUserTimeline';
import { AppUserTimelineReducerActionType } from '../../../../../../states/reducers/user-timeline.reducer';

type SearchResultTabProps = {
	Header: any;
};

function SearchResultsUser({ Header }: SearchResultTabProps) {
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
			<AppFlashList.Users
				data={TimelineState.items}
				onScroll={onScroll}
				refreshing={Refreshing}
				onRefresh={onRefresh}
				ListHeaderComponent={Header}
			/>
			<LoadingMore visible={visible} loading={loading} />
		</View>
	);
}

function SearchResultsPost({ Header }: SearchResultTabProps) {
	const { driver } = useAppApiClient();
	const [Refreshing, setRefreshing] = useState(false);
	const State = useDiscoverTabState();
	const TimelineState = useTimelineState();
	const TimelineDispatch = useTimelineDispatch();
	const { data, fetchStatus, refetch } = useApiSearchPosts(
		State.q,
		TimelineState.appliedMaxId,
	);

	useEffect(() => {
		TimelineDispatch({
			type: AppTimelineReducerActionType.RESET,
		});
	}, [State.q]);

	useEffect(() => {
		if (data.length === 0) return;
		/**
		 * NOTE: Pagination works in weird ways for these drivers
		 */
		const FALLBACK_TO_OFFSET = [
			KNOWN_SOFTWARE.AKKOMA, // KNOWN_SOFTWARE.SHARKEY,
		].includes(driver);

		let maxId = null;
		if (FALLBACK_TO_OFFSET) {
			maxId = (TimelineState.items.length + data.length).toString();
		} else {
			maxId = data[data.length - 1].id;
		}
		TimelineDispatch({
			type: AppTimelineReducerActionType.APPEND_RESULTS,
			payload: {
				items: data,
				maxId,
			},
		});
	}, [fetchStatus]);

	function loadMore() {
		TimelineDispatch({
			type: AppTimelineReducerActionType.REQUEST_LOAD_MORE,
		});
	}

	function onRefresh() {
		setRefreshing(true);
		TimelineDispatch({
			type: AppTimelineReducerActionType.RESET,
		});
		refetch().finally(() => {
			setRefreshing(false);
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
			<AppFlashList.Post
				data={TimelineState.items}
				onScroll={onScroll}
				refreshing={Refreshing}
				onRefresh={onRefresh}
				ListHeaderComponent={Header}
			/>
			<LoadingMore visible={visible} loading={loading} />
		</View>
	);
}

type DiscoverTabFactoryProps = {
	Header: any;
};

/**
 * Renders the results of a
 * search query in discover
 * tab
 */
function DiscoverTabFactory({ Header }: DiscoverTabFactoryProps) {
	const { theme } = useAppTheme();
	const State = useDiscoverTabState();
	const dispatch = useDiscoverTabDispatch();

	useEffect(() => {
		dispatch({
			type: DiscoverTabReducerActionType.CLEAR_SEARCH,
		});
	}, []);

	useEffect(() => {
		switch (State.category) {
			case APP_SEARCH_TYPE.POSTS: {
				break;
			}
			case APP_SEARCH_TYPE.USERS: {
				// if (SomeData?.accounts?.length === 0) return;
				// setMaxId(SomeData.accounts[SomeData.accounts.length - 1].getId());
				// append(SomeData.accounts);
				break;
			}
			default: {
				// if (SomeData?.statuses?.length === 0) return;
				// setMaxId(SomeData.statuses[SomeData.statuses.length - 1].getId());
				// append(SomeData.statuses);
			}
		}
	}, []);

	return useMemo(() => {
		if (!State.q)
			return (
				<View style={{ flex: 1 }}>
					{Header}
					<View
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							flex: 1,
							paddingBottom: 128,
						}}
					>
						<Text
							style={[
								styles.bodyText,
								{
									color: theme.secondary.a10,
									marginBottom: 32,
									fontSize: 20,
									fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
								},
							]}
						>
							More stuff coming{' '}
							<Text style={{ color: theme.complementary.a0 }}>soon™</Text>
						</Text>
						<Text style={[styles.bodyText, { color: theme.secondary.a10 }]}>
							1) Click search icon to toggle widget
						</Text>
						<Text style={[styles.bodyText, { color: theme.secondary.a10 }]}>
							2)️ Submit (↵) to search.
						</Text>
						<Text style={[styles.bodyText, { color: theme.secondary.a10 }]}>
							3) Clear (x) to come back here
						</Text>
					</View>
				</View>
			);

		switch (State.category) {
			case APP_SEARCH_TYPE.POSTS:
				return (
					<WithPostTimelineCtx>
						<SearchResultsPost Header={Header} />
					</WithPostTimelineCtx>
				);
			case APP_SEARCH_TYPE.USERS:
				return (
					<WithUserTimelineCtx>
						<SearchResultsUser Header={Header} />
					</WithUserTimelineCtx>
				);
			default:
				return <View>{Header}</View>;
		}
	}, [State.category, State.q, theme, Header]);
}

export default DiscoverTabFactory;

const styles = StyleSheet.create({
	bodyText: {
		fontFamily: APP_FONTS.INTER_500_MEDIUM,
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 8,
	},
});
