import { Animated, StyleSheet, View } from 'react-native';
import TimelinesHeader from '../../../components/shared/topnavbar/fragments/TopNavbarTimelineStack';
import { AppPostObject } from '../../../types/app-post.types';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import useLoadingMoreIndicatorState from '../../../states/useLoadingMoreIndicatorState';
import { Fragment } from 'react';
import { AppFlashList } from '../../../components/lib/AppFlashList';
import LoadingMore from '../../../components/screens/home/LoadingMore';
import UserPeekModalPresenter from '../../user-profiles/presenters/UserPeekModalPresenter';
import { FetchStatus } from '@tanstack/react-query';
import { appDimensions } from '../../../styles/dimensions';

type TimelinePostListViewProps = {
	items: AppPostObject[];
	numItems: number;
	loadMore: () => void;
	fetchStatus: FetchStatus;
	onRefresh: () => void;
	refreshing: boolean;
};

function TimelinePostListView({
	numItems,
	items,
	loadMore,
	fetchStatus,
	onRefresh,
	refreshing,
}: TimelinePostListViewProps) {
	const { theme } = useAppTheme();
	/**
	 * Composite Hook Collection
	 */
	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: numItems,
		updateQueryCache: loadMore,
	});

	const { visible, loading } = useLoadingMoreIndicatorState({
		fetchStatus,
	});

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: theme.palette.bg,
				},
			]}
		>
			<Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
				<TimelinesHeader />
			</Animated.View>

			<Fragment>
				<AppFlashList.Post
					data={items}
					paddingTop={appDimensions.topNavbar.scrollViewTopPadding + 16}
					refreshing={refreshing}
					onRefresh={onRefresh}
					onScroll={onScroll}
				/>
				<LoadingMore visible={visible} loading={loading} />
				<UserPeekModalPresenter />
			</Fragment>
		</View>
	);
}

export default TimelinePostListView;

const styles = StyleSheet.create({
	header: {
		position: 'absolute',
		backgroundColor: '#1c1c1c',
		left: 0,
		right: 0,
		width: '100%',
		zIndex: 1,
	},
	container: {
		flex: 1,
		position: 'relative',
	},
});
