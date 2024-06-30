import { useQuery } from '@tanstack/react-query';
import { mastodon } from '@dhaaga/shared-provider-mastodon/src';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import React, { useCallback, useEffect, useState } from 'react';
import StatusItem from '../../../common/status/StatusItem';
import WithActivitypubStatusContext from '../../../../states/useStatus';
import WithAppPaginationContext, {
	useAppPaginationContext,
} from '../../../../states/usePagination';
import WithScrollOnRevealContext, {
	useScrollOnReveal,
} from '../../../../states/useScrollOnReveal';
import LoadingMore from '../../home/LoadingMore';
import useTopbarSmoothTranslate from '../../../../states/useTopbarSmoothTranslate';
import NavigationService from '../../../../services/navigation.service';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import { AnimatedFlashList } from '@shopify/flash-list';
import { RefreshControl } from 'react-native';
import { EmojiService } from '../../../../services/emoji.service';
import { useRealm } from '@realm/react';
import { useGlobalMmkvContext } from '../../../../states/useGlobalMMkvCache';

function WithApi() {
	const { client, primaryAcct } = useActivityPubRestClientContext();
	const domain = primaryAcct?.domain;
	const [refreshing, setRefreshing] = useState(false);
	const {
		data: PageData,
		updateQueryCache,
		queryCacheMaxId,
		append,
		setMaxId,
	} = useAppPaginationContext();
	const { resetEndOfPageFlag } = useScrollOnReveal();
	const [LoadingMoreComponentProps, setLoadingMoreComponentProps] = useState({
		visible: false,
		loading: false,
	});
	const db = useRealm();
	const { globalDb } = useGlobalMmkvContext();
	const [EmojisLoading, setEmojisLoading] = useState(false);

	async function api() {
		if (!client) throw new Error('_client not initialized');

		return await client.getBookmarks({
			limit: 5,
			maxId: queryCacheMaxId,
		});
	}

	// Queries
	const { status, data, refetch, fetchStatus } = useQuery<{
		data: mastodon.v1.Status[];
		minId?: string;
		maxId?: string;
	}>({
		queryKey: ['bookmarks', queryCacheMaxId],
		queryFn: api,
		enabled: client !== null,
	});

	useEffect(() => {
		if (fetchStatus === 'fetching') {
			if (PageData.length > 0) {
				setLoadingMoreComponentProps({
					visible: true,
					loading: true,
				});
			}
			return;
		}

		if (status !== 'success' || !data) return;
		if (data?.data?.length > 0) {
			const statuses = data.data;

			setEmojisLoading(true);
			EmojiService.preloadInstanceEmojisForStatuses(
				db,
				globalDb,
				statuses,
				domain,
			)
				.then((res) => {})
				.finally(() => {
					append(statuses, (o) => o.id);
					setMaxId(data.maxId);
					resetEndOfPageFlag();
					setEmojisLoading(false);
				});
		}

		setLoadingMoreComponentProps({
			visible: false,
			loading: false,
		});
	}, [fetchStatus]);

	const onRefresh = async () => {
		refetch();
		setRefreshing(true);
		setLoadingMoreComponentProps({
			visible: true,
			loading: true,
		});
	};

	function onPageEndReached() {
		if (PageData.length > 0) {
			updateQueryCache();
			refetch();
		}
	}

	const handleScrollJs = (e: any) => {
		NavigationService.invokeWhenPageEndReached(e, onPageEndReached);
	};
	const { onScroll, translateY } = useTopbarSmoothTranslate({
		onScrollJsFn: handleScrollJs,
		totalHeight: 100,
		hiddenHeight: 50,
	});

	return (
		<WithAutoHideTopNavBar title={'My Bookmarks'} translateY={translateY}>
			<AnimatedFlashList
				estimatedItemSize={200}
				data={PageData}
				renderItem={(o) => (
					<WithActivitypubStatusContext status={o.item} key={o.index}>
						<StatusItem />
					</WithActivitypubStatusContext>
				)}
				onScroll={onScroll}
				contentContainerStyle={{
					paddingTop: 50 + 4,
				}}
				scrollEventThrottle={16}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			/>
			<LoadingMore
				visible={LoadingMoreComponentProps.visible}
				loading={LoadingMoreComponentProps.loading}
			/>
		</WithAutoHideTopNavBar>
	);
}

function WithContext() {
	return (
		<WithAppPaginationContext>
			<WithScrollOnRevealContext>
				<WithApi />
			</WithScrollOnRevealContext>
		</WithAppPaginationContext>
	);
}

function MyBookmarks() {
	return <WithContext />;
}

export default MyBookmarks;
