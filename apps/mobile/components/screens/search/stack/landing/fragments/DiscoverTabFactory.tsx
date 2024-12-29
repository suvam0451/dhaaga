import { useEffect, useMemo, useState } from 'react';
import useScrollMoreOnPageEnd from '../../../../../../states/useScrollMoreOnPageEnd';
import DiscoverSearchHelper from './DiscoverSearchHelper';
import { APP_SEARCH_TYPE } from '../../../api/useSearch';
import LoadingMore from '../../../../home/LoadingMore';
import useLoadingMoreIndicatorState from '../../../../../../states/useLoadingMoreIndicatorState';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import { View, Text, StyleSheet } from 'react-native';
import useGlobalState from '../../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import AppTabLandingNavbar, {
	APP_LANDING_PAGE_TYPE,
} from '../../../../../shared/topnavbar/AppTabLandingNavbar';
import AppNoAccount from '../../../../../error-screen/AppNoAccount';
import {
	useAppApiClient,
	useAppTheme,
} from '../../../../../../hooks/utility/global-state-extractors';
import {
	useDiscoverTabDispatch,
	useDiscoverTabState,
} from '../../../DiscoverLanding';
import { DiscoverTabReducerActionType } from '../../../../../../states/reducers/discover-tab.reducer';
import WithPostTimelineCtx, {
	useTimelineDispatch,
	useTimelineState,
} from '../../../../../context-wrappers/WithPostTimeline';
import { AppFlashList } from '../../../../../lib/AppFlashList';
import { AppTimelineReducerActionType } from '../../../../../../states/reducers/timeline.reducer';
import { useApiSearchPosts } from '../../../../../../hooks/api/useApiSearch';
import { router } from 'expo-router';
import { APP_ROUTING_ENUM } from '../../../../../../utils/route-list';
import { APP_FONTS } from '../../../../../../styles/AppFonts';

function TabHeader() {
	return (
		<AppTabLandingNavbar
			type={APP_LANDING_PAGE_TYPE.DISCOVER}
			menuItems={[
				{
					iconId: 'user-guide',
					onPress: () => {
						router.navigate(APP_ROUTING_ENUM.GUIDE_DISCOVER_TAB);
					},
				},
			]}
		/>
	);
}

function SearchResultsPost() {
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
		refetch();
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
	const { onScroll, translateY } = useScrollMoreOnPageEnd({
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
				ListHeaderComponent={<TabHeader />}
			/>
			<LoadingMore visible={visible} loading={loading} />
		</View>
	);
}

/**
 * Renders the results of a
 * search query in discover
 * tab
 */
function DiscoverTabFactory() {
	const { theme } = useAppTheme();
	const { acct } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
		})),
	);
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

	const SearchResultComponent = useMemo(() => {
		if (!State.q)
			return (
				<View style={{ flex: 1 }}>
					<TabHeader />
					<View
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							flex: 1,
							paddingBottom: 128,
						}}
					>
						<Text style={[styles.bodyText, { color: theme.secondary.a10 }]}>
							More features will be added here.
						</Text>
						<Text
							style={[
								styles.bodyText,
								{ color: theme.secondary.a10, marginBottom: 16 },
							]}
						>
							For now:
						</Text>
						<Text style={[styles.bodyText, { color: theme.secondary.a10 }]}>
							1) Type and submit to search.
						</Text>
						<Text style={[styles.bodyText, { color: theme.secondary.a10 }]}>
							2) Press (x) to come back here
						</Text>
					</View>
				</View>
			);

		switch (State.category) {
			case APP_SEARCH_TYPE.POSTS:
				return (
					<WithPostTimelineCtx>
						<SearchResultsPost />
					</WithPostTimelineCtx>
				);
			default:
				return (
					<View>
						<TabHeader />
					</View>
				);
		}
	}, [State.category, State.q, theme]);

	if (!acct) return <AppNoAccount tab={APP_LANDING_PAGE_TYPE.DISCOVER} />;

	return (
		<View style={{ height: '100%', backgroundColor: theme.palette.bg }}>
			{SearchResultComponent}
			<DiscoverSearchHelper />
		</View>
	);
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
