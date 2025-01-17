import { Animated, RefreshControl } from 'react-native';
import { appDimensions } from '../../../styles/dimensions';
import { SavedPostItem } from '../../../components/common/status/LocalView/SavedPostItem';
import { CollectionDataViewPostEntry } from '../reducers/collection-detail.reducer';

type Props = {
	items: CollectionDataViewPostEntry[];
	refreshing: boolean;
	onRefresh: () => void;
	onScroll: (...args: any[]) => void;
};

function CollectionDetailView({
	items,
	refreshing,
	onRefresh,
	onScroll,
}: Props) {
	return (
		<Animated.FlatList
			contentContainerStyle={{
				paddingTop: appDimensions.topNavbar.scrollViewTopPadding,
			}}
			data={items}
			renderItem={({ item }) => <SavedPostItem item={item} />}
			refreshControl={
				<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
			}
			onScroll={onScroll}
		/>
	);
}

export default CollectionDetailView;
