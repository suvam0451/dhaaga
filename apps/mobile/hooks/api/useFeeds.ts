import { useQuery } from '@tanstack/react-query';
import type { FeedObjectType } from '@dhaaga/bridge';
import { useAppApiClient } from '#/states/global/hooks';
import { getMyFeedListQueryOpts } from '@dhaaga/react';

function useApiGetMyFeeds() {
	const { client } = useAppApiClient();
	return useQuery<FeedObjectType[]>(getMyFeedListQueryOpts(client));
}

export default useApiGetMyFeeds;
