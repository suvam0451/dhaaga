import { Animated, RefreshControl, View } from 'react-native';
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
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';
import UserListItemView from '../../timelines/view/UserListItemView';
import { appDimensions } from '../../../styles/dimensions';

function ProfileFollowersPresenter() {
	const [Refreshing, setRefreshing] = useState(false);
	const { data, refetch } = useFollowersInteractor();
	const TimelineState = useUserTimelineState();
	const TimelineDispatch = useUserTimelineDispatch();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.GLOSSARY]);

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
				title={t(`noun.follower_other`)}
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
			title={t(`noun.follower_other`)}
			translateY={translateY}
			type={APP_TOPBAR_TYPE_ENUM.GENERIC}
		>
			<Animated.FlatList
				data={TimelineState.items}
				renderItem={({ item }) => <UserListItemView item={item} />}
				onScroll={onScroll}
				ListHeaderComponent={<View />}
				scrollEventThrottle={16}
				refreshControl={
					<RefreshControl refreshing={Refreshing} onRefresh={onRefresh} />
				}
				contentContainerStyle={{
					marginTop: appDimensions.topNavbar.scrollViewTopPadding,
				}}
			/>
		</AppTopNavbar>
	);
}

export default ProfileFollowersPresenter;
