import { FlatList, RefreshControl } from 'react-native';
import { ReactElement, useState } from 'react';

type ListWithSkeletonsProps<T> = {
	items: T[];
	isLoading: boolean;
	onRefresh: () => Promise<void>;
	SkeletonView: () => ReactElement;
	ItemView: (item: T) => ReactElement;
	SkeletonEstimatedHeight: number;
	ListHeaderComponent?: ReactElement;
	onEndReached?: (info: { distanceFromEnd: number }) => void;
};

/**
 * A FlatList renderer, that can also render a list
 * of skeleton views as placeholder
 *
 * The number of skeleton copies to show is
 * estimated, based on ListHeaderComponent input prop
 *
 * @param items
 * @param isLoading
 * @param isRefreshing
 * @param SkeletonView
 * @param SkeletonEstimatedHeight
 * @param onEndReached
 * @param ListHeaderComponent
 * @param ItemView
 * @constructor
 */
function ListWithSkeletonPlaceholder<T>({
	items,
	isLoading,
	SkeletonView,
	SkeletonEstimatedHeight,
	onEndReached,
	ListHeaderComponent,
	ItemView,
	onRefresh,
}: ListWithSkeletonsProps<T>) {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const [NumNodes, setNumNodes] = useState(0);
	function onLayout(event: any) {
		setNumNodes(
			Math.floor(
				event.nativeEvent.layout.height / (SkeletonEstimatedHeight || 100),
			),
		);
	}

	function _onRefresh() {
		setIsRefreshing(true);
		onRefresh().finally(() => {
			setIsRefreshing(false);
		});
	}

	return (
		<FlatList
			onLayout={onLayout}
			data={isLoading ? Array(NumNodes).fill(null) : items}
			renderItem={({ item }) => (isLoading ? SkeletonView() : ItemView(item))}
			ListHeaderComponent={ListHeaderComponent}
			refreshControl={
				<RefreshControl refreshing={IsRefreshing} onRefresh={_onRefresh} />
			}
			contentContainerStyle={{
				paddingBottom: 32,
			}}
			onEndReached={onEndReached}
		/>
	);
}

export { ListWithSkeletonPlaceholder };
