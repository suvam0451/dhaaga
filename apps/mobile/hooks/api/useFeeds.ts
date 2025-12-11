import { useQuery } from '@tanstack/react-query';
import type { FeedObjectType } from '@dhaaga/bridge';
import { useActiveUserSession, useAppApiClient } from '#/states/global/hooks';
import { getMyFeedListQueryOpts } from '@dhaaga/react';

function useApiGetMyFeeds() {
	const { client, driver, server } = useAppApiClient();
	const { acct } = useActiveUserSession();
	return useQuery<FeedObjectType[]>(
		getMyFeedListQueryOpts(client, driver, server, acct.identifier),
	);
}

export default useApiGetMyFeeds;
