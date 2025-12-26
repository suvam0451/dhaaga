import CollectionDetailCtx from '#/features/collections/contexts/CollectionDetailCtx';
import useCollectionDetailInteractor from '#/features/collections/interactors/useCollectionDetailInteractor';
import CollectionEmpty from '#/features/collections/components/CollectionEmpty';
import CollectionDetailWidget from '#/features/collections/components/CollectionDetailWidget';
import { appDimensions } from '#/styles/dimensions';
import { SavedPostItemView } from '#/features/collections/SavedPostItemView';
import { FlatList, RefreshControl } from 'react-native';
import NavBar_Simple from '#/features/navbar/views/NavBar_Simple';
import { useAppTheme } from '#/states/global/hooks';
import useScrollHandleFlatList from '#/hooks/anim/useScrollHandleFlatList';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import { useTranslation } from 'react-i18next';

function Content() {
	const { theme } = useAppTheme();
	const { state, onRefresh, IsRefreshing } = useCollectionDetailInteractor();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.CORE]);

	const { scrollHandler, animatedStyle } = useScrollHandleFlatList();
	return (
		<>
			<NavBar_Simple
				label={t(`topNav.secondary.collection`)}
				animatedStyle={animatedStyle}
			/>
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
