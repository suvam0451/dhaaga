import { memo, useEffect, useState } from 'react';
import { useAppPaginationContext } from '../../../../../../states/usePagination';
import DiscoverListRenderer from './DiscoverListRenderer';
import useScrollMoreOnPageEnd from '../../../../../../states/useScrollMoreOnPageEnd';
import { AnimatedFlashList } from '@shopify/flash-list';
import WithAutoHideTopNavBar from '../../../../../containers/WithAutoHideTopNavBar';
import DiscoverSearchHelper from './DiscoverSearchHelper';
import DiscoverTabListHeader from './DiscoverTabListHeader';
import useSearch, { APP_SEARCH_TYPE } from '../../../api/useSearch';
import LoadingMore from '../../../../home/LoadingMore';
import useLoadingMoreIndicatorState from '../../../../../../states/useLoadingMoreIndicatorState';

/**
 * Renders the results of a
 * search query in discover
 * tab
 */
const DiscoverTabFactory = memo(() => {
	const [SearchTerm, setSearchTerm] = useState('');

	const { data, updateQueryCache, append, setMaxId, queryCacheMaxId, clear } =
		useAppPaginationContext();

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: data.length,
		updateQueryCache,
	});

	const { Data, fetchStatus, IsLoading } = useSearch(APP_SEARCH_TYPE.POSTS, {
		maxId: queryCacheMaxId,
		q: SearchTerm,
		type: 'statuses',
		limit: 10,
		query: SearchTerm,
	});

	useEffect(() => {
		clear();
	}, [SearchTerm]);

	useEffect(() => {
		if (Data.statuses.length === 0) return;
		setMaxId(Data.statuses[Data.statuses.length - 1].getId());
		append(Data.statuses);
	}, [Data]);

	const { visible, loading } = useLoadingMoreIndicatorState({
		fetchStatus,
		additionalLoadingStates: IsLoading,
	});

	return (
		<WithAutoHideTopNavBar title={'Explore'} translateY={translateY}>
			<AnimatedFlashList
				estimatedItemSize={200}
				data={data}
				renderItem={DiscoverListRenderer}
				onScroll={onScroll}
				ListHeaderComponent={DiscoverTabListHeader}
			/>
			<LoadingMore visible={visible} loading={loading} />
			<DiscoverSearchHelper setSearchTerm={setSearchTerm} />
		</WithAutoHideTopNavBar>
	);
});

export default DiscoverTabFactory;
