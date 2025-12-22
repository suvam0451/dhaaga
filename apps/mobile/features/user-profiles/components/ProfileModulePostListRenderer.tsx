import { DefinedUseQueryResult } from '@tanstack/react-query';
import { PostObjectType, ResultPage } from '@dhaaga/bridge';
import {
	PostTimelineStateAction,
	usePostTimelineDispatch,
	usePostTimelineState,
} from '@dhaaga/core';
import ProfileModuleListRenderer from '#/features/user-profiles/components/ProfileModuleListRenderer';
import { useEffect } from 'react';
import { ScrollHandlerProcessed } from 'react-native-reanimated';

type Props = {
	forwardedRef: any;
	onScroll: ScrollHandlerProcessed<Record<string, unknown>>;
	headerHeight: number;
	queryResult: DefinedUseQueryResult<ResultPage<PostObjectType[]>, Error>;
};

function ProfileModulePostListRenderer({
	forwardedRef,
	onScroll,
	queryResult,
	headerHeight,
}: Props) {
	const { data, status, fetchStatus, refetch } = queryResult;

	const State = usePostTimelineState()!;
	const dispatch = usePostTimelineDispatch()!;

	useEffect(() => {
		dispatch({
			type: PostTimelineStateAction.RESET,
		});
	}, []);

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;
		dispatch({
			type: PostTimelineStateAction.APPEND_RESULTS,
			payload: data,
		});
	}, [fetchStatus]);

	async function onRefresh() {
		dispatch({
			type: PostTimelineStateAction.RESET,
		});
		await refetch();
	}

	function onEndReached() {
		dispatch({
			type: PostTimelineStateAction.REQUEST_LOAD_MORE,
		});
	}

	return (
		<ProfileModuleListRenderer
			forwardedRef={forwardedRef}
			data={State.items}
			onScroll={onScroll}
			headerHeight={headerHeight}
			fetchStatus={fetchStatus}
			fnOnEndReached={onEndReached}
			fnOnRefresh={onRefresh}
		/>
	);
}

export default ProfileModulePostListRenderer;
