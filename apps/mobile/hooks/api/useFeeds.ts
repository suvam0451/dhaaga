import { useQuery } from '@tanstack/react-query';
import {
	DriverService,
	type FeedObjectType,
	FeedParser,
	ResultPage,
} from '@dhaaga/bridge';
import {
	useAppAcct,
	useAppApiClient,
} from '../utility/global-state-extractors';
import {
	AtprotoApiAdapter,
	defaultResultPage,
	AtprotoFeedService,
} from '@dhaaga/bridge';

function useApiGetMyFeeds() {
	const { client, driver, server } = useAppApiClient();
	const { acct } = useAppAcct();
	return useQuery<ResultPage<FeedObjectType>>({
		queryKey: ['my/feeds', acct.uuid],
		initialData: defaultResultPage,
		queryFn: async () => {
			const _client = client as AtprotoApiAdapter;
			const result = await _client.me.getPreferences();
			if (result.isErr()) return defaultResultPage;
			const feeds = AtprotoFeedService.extractFeedPreferences(result.unwrap());
			return _client.feeds
				.getFeedGenerators(
					feeds.filter((o) => o.type === 'feed').map((o) => o.value),
				)
				.then((res) =>
					res
						.map((o) => ({
							items: FeedParser.parse<unknown[]>(o, driver, server),
							maxId: null,
							minId: null,
						}))
						.unwrapOrElse(defaultResultPage),
				);
		},
		enabled: !!client && !!acct && DriverService.supportsAtProto(driver),
	});
}

export default useApiGetMyFeeds;
