import { View } from 'react-native';
import useFollowersInteractor from '../interactors/useFollowersInteractor';
import {
	useUserTimelineDispatch,
	useUserTimelineState,
} from '../../timelines/contexts/UserTimelineCtx';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../components/shared/topnavbar/AppTopNavbar';
import { UserListView } from '../../_shared/views/UserListView';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { useState } from 'react';
import { AppUserTimelineReducerActionType } from '../../../states/interactors/user-timeline.reducer';

function ProfileFollowersPresenter() {
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

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: data.items.length,
		updateQueryCache: loadMore,
	});

	if (TimelineState.items.length === 0)
		return (
			<AppTopNavbar
				title={'Followers'}
				translateY={translateY}
				type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			>
				<View />
			</AppTopNavbar>
		);

	/**
	 * NOTE: AT proto does not return a detailed view
	 */
	return (
		<AppTopNavbar
			title={'Followers'}
			translateY={translateY}
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
		>
			<UserListView
				items={TimelineState.items}
				onScroll={onScroll}
				onRefresh={onRefresh}
				refreshing={Refreshing}
				ListHeaderComponent={<View />}
			/>
		</AppTopNavbar>
	);
}

export default ProfileFollowersPresenter;
