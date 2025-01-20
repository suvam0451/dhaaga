import { useEffect } from 'react';
import { CollectionViewActionType } from '../../../features/collections/reducers/collection-detail.reducer';
import { useDbGetSavedPostsForCollection } from '../../../features/collections/api/useCollectionsQuery';
import {
	useCollectionDetailDispatch,
	useCollectionDetailState,
} from '../../../features/collections/contexts/CollectionDetailCtx';
import { useLocalSearchParams } from 'expo-router';

function CollectionPresenter() {
	const params = useLocalSearchParams();
	const id: string = params['id'] as string;
	const { data, refetch } = useDbGetSavedPostsForCollection(id);
	const dispatch = useCollectionDetailDispatch();
	const state = useCollectionDetailState();

	useEffect(() => {
		dispatch({
			type: CollectionViewActionType.INIT,
			payload: {
				refetch,
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
}

export default CollectionPresenter;
