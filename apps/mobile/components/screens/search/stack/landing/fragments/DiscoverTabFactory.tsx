import { memo, useEffect, useState } from 'react';
import { useAppPaginationContext } from '../../../../../../states/usePagination';
import DiscoverListRenderer from './DiscoverListRenderer';
import useScrollMoreOnPageEnd from '../../../../../../states/useScrollMoreOnPageEnd';
import { AnimatedFlashList } from '@shopify/flash-list';
import DiscoverSearchHelper from './DiscoverSearchHelper';
import DiscoverTabListHeader from './DiscoverTabListHeader';
import useSearch, { APP_SEARCH_TYPE } from '../../../api/useSearch';
import LoadingMore from '../../../../home/LoadingMore';
import useLoadingMoreIndicatorState from '../../../../../../states/useLoadingMoreIndicatorState';
import { useDebounce } from 'use-debounce';
import { useAppTimelinePosts } from '../../../../../../hooks/app/timelines/useAppTimelinePosts';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import { View } from 'react-native';
import useGlobalState from '../../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

/**
 * Renders the results of a
 * search query in discover
 * tab
 */
const DiscoverTabFactory = memo(() => {
	const { client, driver, theme } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
			client: o.router,
			theme: o.colorScheme,
		})),
	);
	const [SearchTerm, setSearchTerm] = useState('');
	const [SearchCategory, setSearchCategory] = useState<APP_SEARCH_TYPE>(
		APP_SEARCH_TYPE.POSTS,
	);

	const {
		listItems,
		addPosts: appendTimelineData,
		clear: timelineDataStoreClear,
	} = useAppTimelinePosts();

	const { data, updateQueryCache, append, setMaxId, queryCacheMaxId, clear } =
		useAppPaginationContext();

	const NUM_ITEMS = Math.max(data.length, listItems.length);

	const { Data, fetchStatus, IsLoading, status } = useSearch(SearchCategory, {
		maxId: queryCacheMaxId,
		q: SearchTerm,
		limit: 10,
		query: SearchTerm,
	});

	useEffect(() => {
		// reset the results on account/searchTerm change
		clear();
		timelineDataStoreClear();
	}, [SearchTerm, client, SearchCategory]);

	useEffect(() => {
		switch (SearchCategory) {
			case APP_SEARCH_TYPE.POSTS: {
				if (Data?.statuses?.length === 0) return;
				const FALLBACK_TO_OFFSET = [
					KNOWN_SOFTWARE.AKKOMA,
					// KNOWN_SOFTWARE.SHARKEY,
				].includes(driver);

				if (FALLBACK_TO_OFFSET) {
					setMaxId((listItems.length + Data.statuses.length).toString());
				} else {
					setMaxId(Data.statuses[Data.statuses.length - 1].getId());
				}

				appendTimelineData(Data.statuses);
				break;
			}
			case APP_SEARCH_TYPE.USERS: {
				if (Data?.accounts?.length === 0) return;
				setMaxId(Data.accounts[Data.accounts.length - 1].getId());
				append(Data.accounts);
				break;
			}
			default: {
				if (Data?.statuses?.length === 0) return;
				setMaxId(Data.statuses[Data.statuses.length - 1].getId());
				append(Data.statuses);
			}
		}
	}, [Data, SearchCategory]);

	const { visible, loading } = useLoadingMoreIndicatorState({
		fetchStatus,
		additionalLoadingStates: IsLoading,
	});

	const [debouncedFetchStatus] = useDebounce(fetchStatus, 200);

	const flashListData =
		SearchCategory === APP_SEARCH_TYPE.POSTS ? listItems : data;

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: NUM_ITEMS,
		updateQueryCache,
	});

	return (
		<View style={{ height: '100%', backgroundColor: theme.palette.bg }}>
			<AnimatedFlashList
				estimatedItemSize={200}
				data={flashListData}
				renderItem={({ item }) => {
					return <DiscoverListRenderer item={item} category={SearchCategory} />;
				}}
				onScroll={onScroll}
				ListHeaderComponent={() => {
					return (
						<DiscoverTabListHeader
							query={SearchTerm}
							fetchStatus={debouncedFetchStatus}
							numItems={NUM_ITEMS}
							status={status}
							category={SearchCategory}
						/>
					);
				}}
			/>
			<LoadingMore
				visible={visible}
				loading={loading}
				style={{ bottom: 108 }}
			/>
			<DiscoverSearchHelper
				setSearchTerm={setSearchTerm}
				setSearchCategory={setSearchCategory}
			/>
		</View>
	);
});

export default DiscoverTabFactory;
