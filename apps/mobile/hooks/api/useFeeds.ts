import { useQuery } from '@tanstack/react-query';
import type { FeedObjectType } from '@dhaaga/bridge/typings';
import {
	useAppAcct,
	useAppApiClient,
} from '../utility/global-state-extractors';
import { getMyFeedListQueryOpts } from '@dhaaga/react';

function useApiGetMyFeeds() {
	const { client, driver, server } = useAppApiClient();
	const { acct } = useAppAcct();
	return useQuery<FeedObjectType[]>(
		getMyFeedListQueryOpts(client, driver, server, acct.identifier),
	);
}

export default useApiGetMyFeeds;
