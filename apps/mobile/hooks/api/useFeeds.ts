import { useQuery } from '@tanstack/react-query';
import { type FeedObjectType, FeedParser, ResultPage } from '@dhaaga/bridge';
import {
	useAppAcct,
	useAppApiClient,
} from '../utility/global-state-extractors';
import {
	AtprotoApiAdapter,
	KNOWN_SOFTWARE,
	defaultResultPage,
} from '@dhaaga/bridge';
import { AtprotoFeedService } from '../../services/atproto.service';

function useApiGetMyFeeds() {
	const { client, driver, server } = useAppApiClient();
	const { acct } = useAppAcct();
	return useQuery<ResultPage<FeedObjectType>>({
		queryKey: ['my/feeds', acct],
		initialData: defaultResultPage,
		queryFn: async () => {
			const _client = client as AtprotoApiAdapter;
			const { data: prefs, error: prefError } =
				await _client.me.getPreferences();
			if (prefError) {
				console.log('pref get', prefError);
			}
			const feeds = AtprotoFeedService.extractFeedPreferences(prefs);
			const { data: feedResult, error: feedError } =
				await _client.feeds.getFeedGenerators(
					feeds.filter((o) => o.type === 'feed').map((o) => o.value),
				);
			if (feedError) {
				console.log('feed generator get', feedError);
			}
			return {
				items: FeedParser.parse<unknown[]>(feedResult.feeds, driver, server),
				maxId: null,
				minId: null,
				success: true,
			};
		},
		enabled: !!client && !!acct && driver === KNOWN_SOFTWARE.BLUESKY,
	});
}

export default useApiGetMyFeeds;
