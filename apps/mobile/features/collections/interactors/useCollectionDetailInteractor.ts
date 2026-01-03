import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useDbGetSavedPostsForCollection } from '../api/useCollectionsQuery';
import {
	useCollectionDetailDispatch,
	useCollectionDetailState,
} from '../contexts/CollectionDetailCtx';
import { CollectionViewActionType } from '../reducers/collection-detail.reducer';
import { useActiveUserSession } from '#/states/global/hooks';

function useCollectionDetailInteractor() {
	const params = useLocalSearchParams();
	const id: string = params['id'] as string;
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { data, refetch } = useDbGetSavedPostsForCollection(id);
	const dispatch = useCollectionDetailDispatch();
	const state = useCollectionDetailState();
	const { acct } = useActiveUserSession();

	useEffect(() => {
		dispatch({
			type: CollectionViewActionType.INIT,
			payload: {
				acct: acct,
			},
		});
	}, []);

	useEffect(() => {
		dispatch({
			type: CollectionViewActionType.SET_DATA,
			payload: {
				items: data,
			},
		});
	}, [data]);

	function onRefresh() {
		setIsRefreshing(true);
		refetch().finally(() => {
			setIsRefreshing(false);
		});
	}

	return { state, onRefresh, IsRefreshing };
}

export default useCollectionDetailInteractor;
