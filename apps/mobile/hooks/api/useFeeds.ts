import { useQuery } from '@tanstack/react-query';
import { DriverService, FeedParser } from '@dhaaga/bridge';
import type { FeedObjectType, ResultPage } from '@dhaaga/bridge/typings';
import {
	useAppAcct,
	useAppApiClient,
} from '../utility/global-state-extractors';
import { AtprotoApiAdapter, AtprotoFeedService } from '@dhaaga/bridge';

function useApiGetMyFeeds() {
	const { client, driver, server } = useAppApiClient();
	const { acct } = useAppAcct();
	return useQuery<ResultPage<FeedObjectType>[]>({
		queryKey: ['dhaaga/my/feeds', acct.uuid],
		initialData: [],
		queryFn: async () => {
			const _client = client as AtprotoApiAdapter;
			const result = await _client.me.getPreferences();
			const feeds = AtprotoFeedService.extractFeedPreferences(result);
			const feedGens = await _client.feeds.getFeedGenerators(
				feeds.filter((o) => o.type === 'feed').map((o) => o.value),
			);

			// FIXME: they are not actual feeds. just the meta
			return feedGens.map((o) => ({
				items: FeedParser.parse<unknown[]>(o as any, driver, server),
				maxId: null,
				minId: null,
			}));
		},
		enabled: !!client && !!acct && DriverService.supportsAtProto(driver),
	});
}

export default useApiGetMyFeeds;
