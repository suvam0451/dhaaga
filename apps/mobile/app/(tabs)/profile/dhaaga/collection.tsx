import CollectionDetailCtx from '#/features/collections/contexts/CollectionDetailCtx';
import useCollectionDetailInteractor from '#/features/collections/interactors/useCollectionDetailInteractor';
import CollectionEmpty from '#/features/collections/components/CollectionEmpty';
import CollectionDetailWidget from '#/features/collections/components/CollectionDetailWidget';
import { appDimensions } from '#/styles/dimensions';
import { SavedPostItemView } from '#/features/collections/SavedPostItemView';
import { FlatList, RefreshControl } from 'react-native';
import NavBar_Simple from '#/components/topnavbar/NavBar_Simple';
import useScrollHandleAnimatedList from '#/hooks/anim/useScrollHandleAnimatedList';
import { useAppTheme } from '#/states/global/hooks';

function Content() {
	const { theme } = useAppTheme();
	const { state, onRefresh, IsRefreshing } = useCollectionDetailInteractor();

	const { scrollHandler, animatedStyle } = useScrollHandleAnimatedList();
	return (
		<>
			<NavBar_Simple label={'Collection'} animatedStyle={animatedStyle} />
			<FlatList
				style={{ backgroundColor: theme.background.a0 }}
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

function Page() {
	return (
		<CollectionDetailCtx>
			<Content />
		</CollectionDetailCtx>
	);
}

export default Page;
