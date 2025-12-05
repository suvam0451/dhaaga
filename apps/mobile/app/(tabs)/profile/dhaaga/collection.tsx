import CollectionDetailCtx from '#/features/collections/contexts/CollectionDetailCtx';
import useCollectionDetailInteractor from '#/features/collections/interactors/useCollectionDetailInteractor';
import CollectionEmpty from '#/features/collections/components/CollectionEmpty';
import CollectionDetailWidget from '#/features/collections/components/CollectionDetailWidget';
import { appDimensions } from '#/styles/dimensions';
import { SavedPostItem } from '#/components/common/status/LocalView/SavedPostItem';
import { FlatList, RefreshControl } from 'react-native';
import NavBar_Simple from '#/components/shared/topnavbar/NavBar_Simple';
import useHideTopNavUsingReanimated from '#/hooks/anim/useHideTopNavUsingReanimated';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';

function Content() {
	const { theme } = useAppTheme();
	const { state, onRefresh, IsRefreshing } = useCollectionDetailInteractor();

	const { scrollHandler, animatedStyle } = useHideTopNavUsingReanimated();
	return (
		<>
			<NavBar_Simple label={'Collection'} animatedStyle={animatedStyle} />
			<FlatList
				style={{ backgroundColor: theme.background.a0 }}
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding,
				}}
				data={state.results}
				renderItem={({ item }) => <SavedPostItem item={item} />}
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
