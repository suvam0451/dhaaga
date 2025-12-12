import { useEffect } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useAppApiClient } from '#/states/global/hooks';
import {
	postGetQueryOpts,
	postHierarchyQueryOpts,
	PostThreadAction,
	usePostThreadDispatch,
	usePostThreadState,
} from '@dhaaga/react';
import type { PostObjectType } from '@dhaaga/bridge';

/**
 * Get the context chain for a given status id
 * @param id
 */
function useApiBuildPostThread(id: string) {
	const { client } = useAppApiClient();

	useEffect(() => {
		dispatch({
			type: PostThreadAction.RESET,
		});
	}, [id]);

	const [postDetailQueryResult, postThreadQueryResult] = useQueries({
		queries: [postGetQueryOpts(client, id), postHierarchyQueryOpts(client, id)],
	});

	const state = usePostThreadState();
	const dispatch = usePostThreadDispatch();

	useEffect(() => {
		if (
			postDetailQueryResult.status !== 'success' ||
			postThreadQueryResult.status !== 'success'
		)
			return;

		dispatch({
			type: PostThreadAction.SETUP,
			payload: {
				anchor: postDetailQueryResult.data,
				client,
				chainData: postThreadQueryResult.data,
			},
		});
	}, [postDetailQueryResult.fetchStatus, postThreadQueryResult.fetchStatus]);

	async function refetch() {
		const A = postThreadQueryResult.refetch();
		const B = postDetailQueryResult.refetch();

		return Promise.all([A, B]);
	}

	function getPostHistory(): PostObjectType[] {
		return state.history;
	}

	function getChildren(id: string): PostObjectType[] {
		return (state.children.get(id) ?? []).map((childId) =>
			state.lookup.get(childId),
		);
	}

	const items = state.anchor
		? [
				...getPostHistory().map((o) => ({ type: 'history', post: o })),
				{ type: 'anchor', post: state.anchor },
				...getChildren(state.anchor.uuid).map((o) => ({
					type: 'reply',
					post: o,
				})),
			]
		: [];

	return {
		refetch,
		isFetching:
			postThreadQueryResult.isFetching || postDetailQueryResult.isFetching,
		error: postThreadQueryResult.error || postDetailQueryResult.error,
		getChildren,
		getPostHistory,
		anchor: state.anchor,
		valid: !!state.anchor,
		items,
	};
}

export default useApiBuildPostThread;
