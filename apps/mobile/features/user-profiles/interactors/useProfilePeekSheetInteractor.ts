import {
	useAppApiClient,
	useAppBottomSheet,
} from '../../../hooks/utility/global-state-extractors';
import { useEffect, useState } from 'react';
import useGetProfile, { ProfileSearchQueryType } from '../api/useGetProfile';
import { AppUserObject } from '../../../types/app-user.types';
import DriverService from '../../../services/driver.service';

function useProfilePeekSheetInteractor() {
	const { server } = useAppApiClient();
	const { ctx, stateId } = useAppBottomSheet();
	const [SearchQuery, setSearchQuery] = useState<ProfileSearchQueryType>(null);
	const [UserObject, setUserObject] = useState<AppUserObject>(null);

	const { data, fetchStatus } = useGetProfile(SearchQuery);

	useEffect(() => {
		if (ctx?.did) {
			setSearchQuery({ did: ctx.did });
		} else if (ctx?.handle) {
			const webfinger = DriverService.splitHandle(ctx.handle, server);
			setSearchQuery({ webfinger });
		} else if (ctx?.userId) {
			setSearchQuery({ userId: ctx.userId });
		} else {
			setSearchQuery(null);
		}
	}, [ctx, stateId]);

	useEffect(() => {
		if (fetchStatus === 'fetching' || !data) return;
		setUserObject(data);
	}, [data, fetchStatus]);

	return { data: UserObject };
}

export default useProfilePeekSheetInteractor;
