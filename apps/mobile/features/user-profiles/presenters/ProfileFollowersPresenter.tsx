import { RefreshControl, View, FlatList } from 'react-native';
import useFollowersInteractor from '../interactors/useFollowersInteractor';
import { useState } from 'react';
import {
	UserTimelineStateAction,
	useUserTimelineDispatch,
	useUserTimelineState,
} from '@dhaaga/core';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import UserListItemView from '../../timelines/view/UserListItemView';
import { appDimensions } from '#/styles/dimensions';
import useHideTopNavUsingReanimated from '#/hooks/anim/useHideTopNavUsingReanimated';
import NavBar_Simple from '#/components/shared/topnavbar/NavBar_Simple';

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
			type: UserTimelineStateAction.REQUEST_LOAD_MORE,
		});
	}

	const { scrollHandler, animatedStyle } =
		useHideTopNavUsingReanimated(loadMore);

	/**
	 * NOTE: AT proto does not return a detailed view
	 */
	return (
		<>
			<NavBar_Simple
				label={t(`noun.follower_other`)}
				animatedStyle={animatedStyle}
			/>
			<FlatList
				data={TimelineState.items}
				renderItem={({ item }) => <UserListItemView item={item} />}
				onScroll={scrollHandler}
				ListHeaderComponent={<View />}
				scrollEventThrottle={16}
				refreshControl={
					<RefreshControl refreshing={Refreshing} onRefresh={onRefresh} />
				}
				contentContainerStyle={{
					marginTop: appDimensions.topNavbar.scrollViewTopPadding,
					paddingBottom: 54,
				}}
			/>
		</>
	);
}

export default ProfileFollowersPresenter;
