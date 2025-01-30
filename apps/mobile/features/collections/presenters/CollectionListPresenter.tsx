import { useCollectionListInteractor } from '../api/useCollectionsQuery';
import { View } from 'react-native';
import CollectionListView from '../views/CollectionListView';
import { useState } from 'react';
import { router } from 'expo-router';
import { APP_ROUTING_ENUM } from '../../../utils/route-list';
import useCollections from '../interactors/useCollections';
import { useAppDialog } from '../../../hooks/utility/global-state-extractors';

function CollectionListPresenter() {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { data, error, refetch } = useCollectionListInteractor();
	const { add } = useCollections();
	const { show } = useAppDialog();

	if (error) return <View />;

	function onRefresh() {
		setIsRefreshing(true);
		refetch().finally(() => {
			setIsRefreshing(false);
		});
	}

	function onAdd() {
		show(
			{
				title: 'Add Collection',
				description: [
					'You can further manage collections from the profile (5th) tab.',
				],
				actions: [],
			},
			'Name your collection',
			(text: string) => {
				add(text);
				refetch();
			},
		);
	}

	function onItemPress(id: number) {
		router.navigate({
			pathname: APP_ROUTING_ENUM.APP_FEATURE_COLLECTION,
			params: {
				id,
			},
		});
	}

	function onItemLongPress(id: number) {}

	return (
		<CollectionListView
			onAdd={onAdd}
			onPress={onItemPress}
			onLongPress={onItemLongPress}
			items={data}
			refresh={onRefresh}
			refreshing={IsRefreshing}
		/>
	);
}

export default CollectionListPresenter;
