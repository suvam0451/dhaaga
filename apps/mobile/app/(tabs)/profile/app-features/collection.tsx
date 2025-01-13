import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../../components/shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import WithCollectionViewCtx, {
	useCollectionViewDispatch,
	useCollectionViewState,
} from '../../../../components/context-wrappers/WithCollectionView';
import { View } from 'react-native';
import { useDbGetSavedPostsForCollection } from '../../../../database/queries/useDbCollectionQuery';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { CollectionViewActionType } from '../../../../states/reducers/collection-view.reducer';

function DataView() {
	const params = useLocalSearchParams();
	const id: string = params['id'] as string;

	const { data } = useDbGetSavedPostsForCollection(id);
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
	return <View />;
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
