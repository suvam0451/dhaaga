import {
	useAppApiClient,
	useAppBottomSheet,
} from '../../../hooks/utility/global-state-extractors';
import { useEffect, useState } from 'react';
import { userProfileQueryOpts } from '@dhaaga/react';
import { DriverUserFindQueryType, UserObjectType } from '@dhaaga/bridge';
import DriverService from '../../../services/driver.service';
import { useQuery } from '@tanstack/react-query';

function useProfilePeekSheetInteractor() {
	const { server, client } = useAppApiClient();
	const { ctx, stateId } = useAppBottomSheet();
	const [SearchQuery, setSearchQuery] = useState<DriverUserFindQueryType>(null);
	const [UserObject, setUserObject] = useState<UserObjectType>(null);

	const { data, fetchStatus, isLoading, isFetching } = useQuery(
		userProfileQueryOpts(client, SearchQuery),
	);

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

	useEffect(() => {
		if (fetchStatus === 'fetching' || !data) return;
		setUserObject(data);
	}, [data, fetchStatus]);

	return { data: UserObject, isLoading, isFetching };
}

export default useProfilePeekSheetInteractor;
