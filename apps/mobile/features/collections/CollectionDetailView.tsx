import CollectionDetailCtx from './contexts/CollectionDetailCtx';
import useCollectionDetailInteractor from '#/features/collections/interactors/useCollectionDetailInteractor';
import CollectionEmpty from '#/features/collections/components/CollectionEmpty';
import CollectionDetailWidget from '#/features/collections/components/CollectionDetailWidget';
import { appDimensions } from '#/styles/dimensions';
import { SavedPostItemView } from '#/features/collections/SavedPostItemView';
import { Animated, RefreshControl } from 'react-native';
import NavBar_Simple from '#/components/topnavbar/NavBar_Simple';
import useScrollHandleAnimatedList from '#/hooks/anim/useScrollHandleAnimatedList';

function Content() {
	const { state, onRefresh, IsRefreshing } = useCollectionDetailInteractor();
	const { animatedStyle, scrollHandler } = useScrollHandleAnimatedList();

	return (
		<>
			<NavBar_Simple label={'Collection'} animatedStyle={animatedStyle} />
			<Animated.FlatList
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding,
				}}
				data={state.results}
				renderItem={({ item }) => <SavedPostItemView item={item} />}
				refreshControl={
					<RefreshControl refreshing={IsRefreshing} onRefresh={onRefresh} />
				}
				onScroll={scrollHandler}
				ListEmptyComponent={<CollectionEmpty />}
			/>
			<CollectionDetailWidget />
		</>
	);
}

function CollectionDetailView() {
	return (
		<CollectionDetailCtx>
			<Content />
		</CollectionDetailCtx>
	);
}

export default CollectionDetailView;
