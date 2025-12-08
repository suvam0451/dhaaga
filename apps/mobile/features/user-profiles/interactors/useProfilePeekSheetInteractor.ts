import {
	useAppApiClient,
	useAppBottomSheet,
} from '#/hooks/utility/global-state-extractors';
import { useEffect, useState } from 'react';
import { userProfileQueryOpts } from '@dhaaga/react';
import { DriverUserFindQueryType } from '@dhaaga/bridge';
import DriverService from '#/services/driver.service';
import { useQuery } from '@tanstack/react-query';

function useProfilePeekSheetInteractor() {
	const { server, client } = useAppApiClient();
	const { ctx, stateId } = useAppBottomSheet();
	const [SearchQuery, setSearchQuery] = useState<DriverUserFindQueryType>(null);

	useEffect(() => {
		if (ctx?.did) {
			setSearchQuery({ use: 'did', did: ctx.did });
		} else if (ctx?.handle) {
			const webfinger = DriverService.splitHandle(ctx.handle, server);
			setSearchQuery({ use: 'webfinger', webfinger });
		} else if (ctx?.userId) {
			setSearchQuery({ use: 'userId', userId: ctx.userId });
		} else {
			setSearchQuery(null);
		}
	}, [ctx, stateId]);

	return useQuery(userProfileQueryOpts(client, SearchQuery));
}

export default useProfilePeekSheetInteractor;
