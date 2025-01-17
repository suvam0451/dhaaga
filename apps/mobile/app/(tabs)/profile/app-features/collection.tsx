import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../../components/shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import CollectionViewCtx, {
	useCollectionViewDispatch,
	useCollectionViewState,
} from '../../../../features/collections/contexts/CollectionViewCtx';
import { FlatList, RefreshControl, View } from 'react-native';
import { useDbGetSavedPostsForCollection } from '../../../../features/collections/api/useCollectionsQuery';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { CollectionViewActionType } from '../../../../features/collections/reducers/collection-view.reducer';
import { SavedPostItem } from '../../../../components/common/status/LocalView/SavedPostItem';
import { appDimensions } from '../../../../styles/dimensions';
import Widget from '../../../../features/collections/components/Widget';

function DataView() {
	const params = useLocalSearchParams();
	const id: string = params['id'] as string;
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { data, refetch } = useDbGetSavedPostsForCollection(id);
	const dispatch = useCollectionViewDispatch();
	const state = useCollectionViewState();

	useEffect(() => {
		dispatch({
			type: CollectionViewActionType.SET_DATA,
			payload: {
				items: data,
			},
		});
	}, [data]);

	function onRefresh() {
		setIsRefreshing(true);
		refetch().finally(() => {
			setIsRefreshing(false);
		});
	}

	return (
		<View style={{ position: 'relative', height: '100%' }}>
			<FlatList
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding,
				}}
				data={state.results}
				renderItem={({ item }) => <SavedPostItem item={item} />}
				refreshControl={
					<RefreshControl refreshing={IsRefreshing} onRefresh={onRefresh} />
				}
			/>
			<Widget />
		</View>
	);
}

function Page() {
	const { translateY } = useScrollMoreOnPageEnd();

	return (
		<CollectionViewCtx>
			<AppTopNavbar
				type={APP_TOPBAR_TYPE_ENUM.GENERIC}
				title={'Collection'}
				translateY={translateY}
			>
				<DataView />
			</AppTopNavbar>
		</CollectionViewCtx>
	);
}

export default Page;
