import WithAppStatusContextDataContext from '../../../../hooks/api/statuses/WithAppStatusContextData';
import { useLocalSearchParams } from 'expo-router';
import useGetStatusCtxInterface from '../../../../hooks/api/statuses/useGetStatusCtxInterface';
import PostDetailPresenter from './presenters/PostDetailPresenter';

function PostDetailView() {
	const { id, uri } = useLocalSearchParams<{ id: string; uri: string }>();
	const { Data, dispatch, refetch } = useGetStatusCtxInterface(
		id === 'uri' ? uri : id,
	);

	return (
		<WithAppStatusContextDataContext data={Data} dispatch={dispatch}>
			<PostDetailPresenter refetch={refetch} />
		</WithAppStatusContextDataContext>
	);
}

export default PostDetailView;
