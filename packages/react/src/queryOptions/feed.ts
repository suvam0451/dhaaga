import {
	ApiTargetInterface,
	AtprotoApiAdapter,
	AtprotoFeedService,
	FeedParser,
	KNOWN_SOFTWARE,
} from '@dhaaga/bridge';
import type { FeedObjectType } from '@dhaaga/bridge/typings';
import { queryOptions } from '@tanstack/react-query';

export function getMyFeedListQueryOpts(
	client: ApiTargetInterface,
	driver: KNOWN_SOFTWARE,
	server: string,
	acctIdentifier: string,
) {
	async function api() {
		const _client = client as AtprotoApiAdapter;
		const result = await _client.me.getPreferences();
		const feeds = AtprotoFeedService.extractFeedPreferences(result);
		const feedGens = await _client.feeds.getFeedGenerators(
			feeds.filter((o) => o.type === 'feed').map((o) => o.value),
		);

		// FIXME: they are not actual feeds. just the meta
		return feedGens.map((o) =>
			FeedParser.parse<unknown>(o as any, driver, server),
		);
	}

	return queryOptions<FeedObjectType[]>({
		queryKey: ['dhaaga/my/feeds', acctIdentifier],
		queryFn: api,
		enabled: client !== null,
	});
}
