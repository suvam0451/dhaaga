import { useEffect } from 'react';
import {
	usePostTimelineState,
	usePostTimelineDispatch,
	PostTimelineStateAction,
} from '@dhaaga/core';
import { useLocalSearchParams } from 'expo-router';
import { useAppDb } from '../../../hooks/utility/global-state-extractors';
import useTimelineQuery from '../api/useTimelineQuery';
import TimelinePresenter from '../presenters/TimelinePresenter';
import TimelineErrorView from '../view/TimelineErrorView';
import { PostTimelinePlaceholderView } from '../components/PostSkeletonView';

function TimelineInteractor() {
	const { db } = useAppDb();

	const State = usePostTimelineState();
	const dispatch = usePostTimelineDispatch();

	// reset the timeline on param change
	const params = useLocalSearchParams();
	const pinId: string = params['pinId'] as string;
	const pinType: string = params['pinType'] as string;

	useEffect(() => {
		if (!db) return;
		dispatch({
			type: PostTimelineStateAction.INIT,
			payload: {
				db,
			},
		});

		if (!pinType || !pinId) return;
		if (pinId) {
			dispatch({
				type: PostTimelineStateAction.RESET_USING_PIN_ID,
				payload: {
					id: parseInt(pinId),
					type: pinType as 'feed' | 'user' | 'tag',
				},
			});
		}
	}, [pinId, pinType, db]);

	useEffect(() => {
		dispatch({
			type: PostTimelineStateAction.RESET,
		});
	}, [State.feedType, State.query, State.opts, db]);

	const { fetchStatus, data, status, refetch, error, isFetched } =
		useTimelineQuery({
			type: State.feedType,
			query: State.query,
			opts: State.opts,
			maxId: State.appliedMaxId,
			sessionId: State.sessionId,
		});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;
		dispatch({
			type: PostTimelineStateAction.APPEND_RESULTS,
			payload: data,
		});
	}, [fetchStatus]);

	if (State.items.length === 0 && !isFetched)
		return <PostTimelinePlaceholderView />;
	if (error) return <TimelineErrorView error={error} />;
	return <TimelinePresenter refetch={refetch} fetchStatus={fetchStatus} />;
}

export default TimelineInteractor;
