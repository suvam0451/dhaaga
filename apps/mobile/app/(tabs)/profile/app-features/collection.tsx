import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../../components/shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import WithCollectionViewCtx, {
	useCollectionViewDispatch,
	useCollectionViewState,
} from '../../../../components/context-wrappers/WithCollectionView';
import { FlatList, RefreshControl, View } from 'react-native';
import { useDbGetSavedPostsForCollection } from '../../../../database/queries/useDbCollectionQuery';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { CollectionViewActionType } from '../../../../states/reducers/collection-view.reducer';
import { SavedPostItem } from '../../../../components/common/status/LocalView/SavedPostItem';
import { Image } from 'expo-image';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';
import { appDimensions } from '../../../../styles/dimensions';

function DataView() {
	const params = useLocalSearchParams();
	const id: string = params['id'] as string;
	const { theme } = useAppTheme();
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { data, refetch } = useDbGetSavedPostsForCollection(id);
	const dispatch = useCollectionViewDispatch();
	const state = useCollectionViewState();

	useEffect(() => {
		dispatch({
			type: CollectionViewActionType.LOAD,
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
			<View
				style={{
					position: 'absolute',

					width: '100%',
					bottom: 0,
				}}
			>
				<View
					style={{
						flex: 1,
						marginHorizontal: 10,
						paddingVertical: 12,
						borderRadius: 12,
						backgroundColor: theme.background.a40,
					}}
				>
					<FlatList
						horizontal={true}
						data={state.users}
						renderItem={({ item }) => (
							<View style={{ marginHorizontal: 4 }}>
								{/*@ts-ignore-next-line*/}
								<Image
									source={{ uri: item.item.avatarUrl }}
									style={{ width: 64, height: 64, borderRadius: 32 }}
								/>
							</View>
						)}
					/>
				</View>
			</View>
		</View>
	);
}

function Page() {
	const { translateY } = useScrollMoreOnPageEnd();

	return (
		<WithCollectionViewCtx>
			<AppTopNavbar
				type={APP_TOPBAR_TYPE_ENUM.GENERIC}
				title={'Collection'}
				translateY={translateY}
			>
				<DataView />
			</AppTopNavbar>
		</WithCollectionViewCtx>
	);
}

export default Page;
