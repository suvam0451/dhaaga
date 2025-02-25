import { useEffect } from 'react';
import { AppTimelineReducerActionType } from '../../../states/interactors/post-timeline.reducer';
import { useLocalSearchParams } from 'expo-router';
import { useAppDb } from '../../../hooks/utility/global-state-extractors';
import {
	useTimelineDispatch,
	useTimelineState,
} from '../contexts/PostTimelineCtx';
import useTimelineQuery from '../api/useTimelineQuery';
import TimelinePresenter from '../presenters/TimelinePresenter';
import TimelineErrorView from '../view/TimelineErrorView';

function TimelineInteractor() {
	const { db } = useAppDb();

	const State = useTimelineState();
	const dispatch = useTimelineDispatch();

	// reset the timeline on param change
	const params = useLocalSearchParams();
	const pinId: string = params['pinId'] as string;
	const pinType: string = params['pinType'] as string;

	useEffect(() => {
		if (!db) return;
		dispatch({
			type: AppTimelineReducerActionType.INIT,
			payload: {
				db,
			},
		});

		if (!pinType || !pinId) return;
		if (pinId) {
			dispatch({
				type: AppTimelineReducerActionType.RESET_USING_PIN_ID,
				payload: {
					id: parseInt(pinId),
					type: pinType as 'feed' | 'user' | 'tag',
				},
			});
		}
	}, [pinId, pinType, db]);

	useEffect(() => {
		dispatch({
			type: AppTimelineReducerActionType.RESET,
		});
	}, [State.feedType, State.query, State.opts, db]);

	const { fetchStatus, data, status, refetch, error } = useTimelineQuery({
		type: State.feedType,
		query: State.query,
		opts: State.opts,
		maxId: State.appliedMaxId,
		sessionId: State.sessionId,
	});

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;
		dispatch({
			type: AppTimelineReducerActionType.APPEND_RESULTS,
			payload: data,
		});
	}, [fetchStatus]);

	if (error) return <TimelineErrorView error={error} />;
	return <TimelinePresenter refetch={refetch} fetchStatus={fetchStatus} />;
}

export default TimelineInteractor;
