import { useAppApiClient } from '../../../../../hooks/utility/global-state-extractors';
import { AtprotoApiAdapter, AtprotoFeedService } from '@dhaaga/bridge';
import { useQuery } from '@tanstack/react-query';
import { FeedParser } from '@dhaaga/bridge';

function useApiGetFeedDetails(uri: string) {
	const { client } = useAppApiClient();
	const _client = client as AtprotoApiAdapter;
	const { driver, server } = useAppApiClient();

	const queryResult = useQuery({
		queryKey: ['feed/view', uri],
		enabled: !!client,
		queryFn: async () => {
			const getPrefPromise = _client.me.getPreferences();
			const getFeedPromise = _client.timelines.getFeedGenerator(uri);
			const [feedResult, prefResult] = await Promise.all([
				getFeedPromise,
				getPrefPromise,
			]);
			const feedPrefs = AtprotoFeedService.extractFeedPreferences(prefResult);
			const _pref = feedPrefs?.find(
				(o) => o.type === 'feed' && o.value === uri,
			);
			return {
				feed: FeedParser.parse<unknown>(feedResult.data.view, driver, server),
				pref: feedPrefs?.find((o) => o.type === 'feed' && o.value === uri),
				subscribed: !!_pref,
				pinned: _pref?.pinned || false,
			};
		},
		initialData: {
			feed: null,
			pref: null,
			subscribed: false,
			pinned: false,
		},
	});

	async function toggleSubscription() {
		if (queryResult.error || !queryResult.data) return;
		if (queryResult.data.subscribed) {
			await _client.feeds.removeSubscription(uri);
		} else {
			await _client.feeds.addSubscription(uri);
		}
		await queryResult.refetch();
	}

	async function togglePin() {
		if (queryResult.error || !queryResult.data) return;
		// cannot pin, if not subscribed
		if (!queryResult.data.subscribed) return;

		if (queryResult.data.pinned) {
			await _client.feeds.removePin(uri);
		} else {
			await _client.feeds.pin(uri);
		}
		await queryResult.refetch();
	}

	async function toggleLike() {
		if (queryResult.error || !queryResult.data) return;
	}

	return {
		...queryResult,
		toggleSubscription,
		togglePin,
		toggleLike,
	};
}

export default useApiGetFeedDetails;
