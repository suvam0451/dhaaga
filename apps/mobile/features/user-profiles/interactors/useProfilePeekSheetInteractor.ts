import { useAppBottomSheet_Improved } from '../../../hooks/utility/global-state-extractors';
import { useEffect, useState } from 'react';
import useGetProfile from '../api/useGetProfile';
import { AppUserObject } from '../../../types/app-user.types';

function useProfilePeekSheetInteractor() {
	const { ctx, stateId } = useAppBottomSheet_Improved();
	const [UserId, setUserId] = useState<string>(null);
	const [UserObject, setUserObject] = useState<AppUserObject>(null);

	const { data, fetchStatus } = useGetProfile({
		userId: UserId,
	});

	useEffect(() => {
		if (ctx?.did) {
			setUserId(ctx?.did);
		}
	}, [ctx, stateId]);

	useEffect(() => {
		if (fetchStatus === 'fetching' || !data) return;
		setUserObject(data);
	}, [data, fetchStatus]);

	return { data: UserObject };
}

export default useProfilePeekSheetInteractor;
