import NotificationItemPresenter from '../features/inbox/presenters/NotificationItemPresenter';
import Header from '../features/inbox/components/Header';
import { APP_LANDING_PAGE_TYPE } from '../components/shared/topnavbar/AppTabLandingNavbar';
import { FlatList, RefreshControl } from 'react-native';
import { useState } from 'react';

type ListWithSkeletonsProps = {
	items: any[];
	isLoading: boolean;
	isRefreshing: boolean;
	refresh: () => {};
	SkeletonView: JSX.Element;
	SkeletonEstimatedHeight: number;
	onEndReached?: (info: { distanceFromEnd: number }) => void;
};

function ListWithPlaceholder({
	items,
	isLoading,
	isRefreshing,
	refresh,
	SkeletonView,
	SkeletonEstimatedHeight,
	onEndReached,
}: ListWithSkeletonsProps) {
	const [NumNodes, setNumNodes] = useState(0);
	function onLayout(event: any) {
		setNumNodes(
			Math.floor(
				event.nativeEvent.layout.height / (SkeletonEstimatedHeight || 100),
			),
		);
	}

	return (
		<FlatList
			onLayout={onLayout}
			data={isLoading ? Array(NumNodes).fill(null) : items}
			renderItem={({ item }) =>
				isLoading ? SkeletonView : <NotificationItemPresenter item={item} />
			}
			ListHeaderComponent={<Header type={APP_LANDING_PAGE_TYPE.MENTIONS} />}
			refreshControl={
				<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
			}
			contentContainerStyle={{
				paddingBottom: 32,
			}}
			onEndReached={onEndReached}
		/>
	);
}

export { ListWithPlaceholder };
