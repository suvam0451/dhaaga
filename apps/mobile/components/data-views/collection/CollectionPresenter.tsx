import { useEffect } from 'react';
import { CollectionViewActionType } from '../../../features/collections/reducers/collection-view.reducer';
import { useDbGetSavedPostsForCollection } from '../../../features/collections/api/useCollectionsQuery';
import {
	useCollectionViewDispatch,
	useCollectionViewState,
} from '../../../features/collections/contexts/CollectionViewCtx';
import { useLocalSearchParams } from 'expo-router';

function CollectionPresenter() {
	const params = useLocalSearchParams();
	const id: string = params['id'] as string;
	const { data, refetch } = useDbGetSavedPostsForCollection(id);
	const dispatch = useCollectionViewDispatch();
	const state = useCollectionViewState();

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
