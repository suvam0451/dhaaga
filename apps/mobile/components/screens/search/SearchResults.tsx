import { useQuery } from '@tanstack/react-query';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import { Fragment, useEffect, useState } from 'react';
import { useScrollOnReveal } from '../../../states/useScrollOnReveal';
import NoResults from '../../error-screen/NoResults';
import SearchScreenManual from '../../error-screen/SearchScreenManual';
import AppLoadingIndicator from '../../error-screen/AppLoadingIndicator';
import { useAppPaginationContext } from '../../../states/usePagination';
import { AnimatedFlashList } from '@shopify/flash-list';
import WithActivitypubStatusContext from '../../../states/useStatus';
import StatusItem from '../../common/status/StatusItem';
import LoadingMore from '../home/LoadingMore';
import {
	MastodonRestClient,
	MisskeyRestClient,
} from '@dhaaga/shared-abstraction-activitypub';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';

type SearchResultsProps = {
	q: string;
	type: 'accounts' | 'hashtags' | 'statuses' | null | undefined;
	onScroll: any;
};

function SearchResults(props: SearchResultsProps) {
	const { client, domain } = useActivityPubRestClientContext();
	const { resetOffset, resetEndOfPageFlag } = useScrollOnReveal();

	const {
		data: PageData,
		setMaxId,
		append,
		maxId,
		clear,
		paginationLock,
	} = useAppPaginationContext();

	const [refreshing, setRefreshing] = useState(false);
	const [LoadingMoreComponentProps, setLoadingMoreComponentProps] = useState({
		visible: false,
		loading: false,
	});

	async function api(): Promise<{
		accounts: any[];
		hashtags: any[];
		statuses: any[];
	}> {
		if (!client) {
			return {
				accounts: [],
				hashtags: [],
				statuses: [],
			};
		}
		if (!props.q) return null;
		if (domain === KNOWN_SOFTWARE.MASTODON) {
			const { data, error } = await (
				client as MastodonRestClient
			).search.unifiedSearch({
				q: props.q,
				following: false,
				type: null,
				maxId,
			});
			if (error)
				return {
					statuses: [],
					accounts: [],
					hashtags: [],
				};
			return data;
		} else {
			const { data, error } = await (
				client as MisskeyRestClient
			).search.findPosts({
				q: props.q,
				query: props.q,
				limit: 20,
			});
			if (error)
				return {
					statuses: [],
					accounts: [],
					hashtags: [],
				};
			return {
				statuses: data,
				accounts: [],
				hashtags: [],
			};
		}
	}

	// Queries
	const { status, data, fetchStatus } = useQuery({
		queryKey: ['search', props.q, props.type],
		queryFn: api,
		enabled: client !== null && !paginationLock,
	});

	useEffect(() => {
		clear();
	}, [props.q]);

	useEffect(() => {
		if (fetchStatus === 'fetching') {
			if (PageData.length > 0) {
				setLoadingMoreComponentProps({
					visible: true,
					loading: true,
				});
			}
		}

		if (status !== 'success' || !data) return;
		if (status === 'success' && !paginationLock && data.statuses.length > 0) {
			setMaxId(data.statuses[data.statuses.length - 1]?.id);
			append(data.statuses);
			resetEndOfPageFlag();
		}

		setLoadingMoreComponentProps({
			visible: false,
			loading: false,
		});
	}, [fetchStatus, status, paginationLock]);

	useEffect(() => {
		if (status === 'success') {
			setRefreshing(false);
			resetOffset();
		}
	}, [status, data, refreshing]);

	if (!props.q || props.q === '') return <SearchScreenManual />;
	if (fetchStatus === 'fetching' && PageData.length === 0)
		return <AppLoadingIndicator text={'Loading...'} searchTerm={props.q} />;
	if (status === 'success' && data?.statuses?.length === 0)
		return (
			<NoResults
				text={'No results 🤔'}
				subtext={'Try change categories' + ' or' + ' a different keyword'}
			/>
		);

	return (
		<Fragment>
			<AnimatedFlashList
				estimatedItemSize={200}
				data={PageData}
				renderItem={(o) => (
					<WithActivitypubStatusContext status={o.item} key={o.index}>
						<StatusItem key={o.index} />
					</WithActivitypubStatusContext>
				)}
				onScroll={props.onScroll}
				contentContainerStyle={{
					paddingTop: 50 + 4,
				}}
				scrollEventThrottle={16}
			/>
			<LoadingMore
				visible={LoadingMoreComponentProps.visible}
				loading={LoadingMoreComponentProps.loading}
			/>
		</Fragment>
	);
}

export default SearchResults;
