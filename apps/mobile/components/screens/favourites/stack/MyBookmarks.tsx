import { useQuery } from '@tanstack/react-query';
import { mastodon } from '@dhaaga/shared-provider-mastodon';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { useEffect, useState } from 'react';
import StatusItem from '../../../common/status/StatusItem';
import WithActivitypubStatusContext from '../../../../states/useStatus';
import WithAppPaginationContext, {
	useAppPaginationContext,
} from '../../../../states/usePagination';
import WithScrollOnRevealContext, {
	useScrollOnReveal,
} from '../../../../states/useScrollOnReveal';
import LoadingMore from '../../home/LoadingMore';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import { AnimatedFlashList } from '@shopify/flash-list';
import { RefreshControl } from 'react-native';
import { EmojiService } from '../../../../services/emoji.service';
import { useRealm } from '@realm/react';
import { useGlobalMmkvContext } from '../../../../states/useGlobalMMkvCache';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import usePageRefreshIndicatorState from '../../../../states/usePageRefreshIndicatorState';
import {
	MastoStatus,
	MegaStatus,
} from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_interface';
import useLoadingMoreIndicatorState from '../../../../states/useLoadingMoreIndicatorState';

type Props = {
	content: any[];
	onScroll: any;
	refreshing: any;
	onRefresh: any;
};

function ListContent({ content, onScroll, refreshing, onRefresh }: Props) {
	useEffect(() => {}, []);

	return (
		<AnimatedFlashList
			estimatedItemSize={100}
			data={content}
			renderItem={({ item }) => (
				<WithActivitypubStatusContext status={item}>
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
	);
}

function WithApi() {
	const { client, primaryAcct } = useActivityPubRestClientContext();
	const domain = primaryAcct?.domain;
	const {
		data: PageData,
		updateQueryCache,
		queryCacheMaxId,
		append,
		setMaxId,
	} = useAppPaginationContext();
	const db = useRealm();
	const { globalDb } = useGlobalMmkvContext();
	const [EmojisLoading, setEmojisLoading] = useState(false);

	async function api() {
		if (!client) throw new Error('_client not initialized');
		const { data, error } = await client.bookmarks.get({
			limit: 5,
			maxId: queryCacheMaxId,
		});
		if (error) {
			return { data: [], maxId: null, minId: null };
		}
		return data;
	}

	// Queries
	const { status, data, refetch, fetchStatus } = useQuery<{
		data: MastoStatus[] | MegaStatus[];
		minId?: string;
		maxId?: string;
	}>({
		queryKey: ['bookmarks', queryCacheMaxId],
		queryFn: api,
		enabled: client !== null,
	});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;

		if (data?.data?.length > 0) {
			const statuses = data?.data;

			setMaxId(data.maxId);
			setEmojisLoading(true);
			EmojiService.preloadInstanceEmojisForStatuses(
				db,
				globalDb,
				statuses,
				domain,
			).finally(() => {
				append(statuses, (o) => o.id);
				setEmojisLoading(false);
			});
		}
	}, [fetchStatus]);

	/**
	 * Composite Hook Collection
	 */
	const { visible, loading } = useLoadingMoreIndicatorState({
		fetchStatus,
		additionalLoadingStates: EmojisLoading,
	});
	const { onRefresh, refreshing } = usePageRefreshIndicatorState({
		fetchStatus,
		refetch,
	});
	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: PageData.length,
		updateQueryCache,
	});

	return (
		<WithAutoHideTopNavBar title={'My Bookmarks'} translateY={translateY}>
			<ListContent
				content={PageData}
				onScroll={onScroll}
				onRefresh={onRefresh}
				refreshing={refreshing}
			/>
			<LoadingMore visible={visible} loading={loading} />
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
