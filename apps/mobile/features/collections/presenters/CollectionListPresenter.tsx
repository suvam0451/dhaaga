import { useDbListCollections } from '../api/useCollectionsQuery';
import { View } from 'react-native';
import CollectionListInteractor from '../interactors/CollectionListInteractor';

function CollectionListPresenter() {
	const { data, error, refetch } = useDbListCollections();

	if (error) return <View />;

	return <CollectionListInteractor items={data} refetch={refetch} />;
}

export default CollectionListPresenter;
