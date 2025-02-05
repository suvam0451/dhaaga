import { View } from 'react-native';
import { useState } from 'react';
import useFollowersInteractor from '../interactors/useFollowersInteractor';
import {
	useUserTimelineDispatch,
	useUserTimelineState,
} from '../../timelines/contexts/UserTimelineCtx';
import { AppUserTimelineReducerActionType } from '../../../states/interactors/user-timeline.reducer';

function ProfileFollowingsPresenter() {
	const [Refreshing, setRefreshing] = useState(false);
	const { data, refetch } = useFollowersInteractor();
	const TimelineState = useUserTimelineState();
	const TimelineDispatch = useUserTimelineDispatch();

	function onRefresh() {
		setRefreshing(true);
		refetch().finally(() => {
			setRefreshing(false);
		});
	}

	function loadMore() {
		TimelineDispatch({
			type: AppUserTimelineReducerActionType.REQUEST_LOAD_MORE,
		});
	}

	return <View />;
}

export default ProfileFollowingsPresenter;
