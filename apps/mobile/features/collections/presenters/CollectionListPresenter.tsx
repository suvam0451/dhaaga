import { useCollectionListInteractor } from '../api/useCollectionsQuery';
import { View } from 'react-native';
import CollectionListView from '../views/CollectionListView';

function CollectionListPresenter() {
	const { data, error, refetch } = useCollectionListInteractor();

	if (error) return <View />;

	return <CollectionListView items={data} refetch={refetch} />;
}

export default CollectionListPresenter;
