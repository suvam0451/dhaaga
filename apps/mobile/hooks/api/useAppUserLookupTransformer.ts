import { useAppApiClient, useAppBottomSheet } from '#/states/global/hooks';
import { useEffect, useState } from 'react';
import { userProfileQueryOpts } from '@dhaaga/react';
import { DriverUserFindQueryType } from '@dhaaga/bridge';
import DriverService from '#/services/driver.service';
import { useQuery } from '@tanstack/react-query';

/**
 *
 */
function useAppUserLookupTransformer() {
	const { server, client } = useAppApiClient();
	const { ctx, stateId } = useAppBottomSheet();
	const [SearchQuery, setSearchQuery] = useState<DriverUserFindQueryType>(null);

	useEffect(() => {
		if (ctx.$type !== 'user-preview') return setSearchQuery(null);
		switch (ctx.use) {
			case 'did': {
				setSearchQuery({ use: 'did', did: ctx.did });
				break;
			}
			case 'handle': {
				const webfinger = DriverService.splitHandle(ctx.handle, server);
				setSearchQuery({ use: 'webfinger', webfinger });
				break;
			}
			case 'userId': {
				setSearchQuery({ use: 'userId', userId: ctx.userId });
				break;
			}
			default: {
				throw new Error('Invalid strategy being used to lookup user details');
			}
		}
	}, [stateId]);

	return useQuery(userProfileQueryOpts(client, SearchQuery));
}

export default useAppUserLookupTransformer;
