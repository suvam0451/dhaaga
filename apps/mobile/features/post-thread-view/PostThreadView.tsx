import { useLocalSearchParams } from 'expo-router';
import WithAppStatusContextDataContext from '#/hooks/api/statuses/WithAppStatusContextData';
import useGetStatusCtxInterface from '#/hooks/api/statuses/useGetStatusCtxInterface';
import PostDetailPresenter from './PostDetailPresenter';

function PostThreadView() {
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

export default PostThreadView;
