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
