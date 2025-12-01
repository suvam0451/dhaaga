import { RefreshControl, StyleSheet, View } from 'react-native';
import TimelinesHeader from '#/components/shared/topnavbar/fragments/TopNavbarTimelineStack';
import type { PostObjectType } from '@dhaaga/bridge';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import { TimelineLoadingIndicator } from '#/ui/LoadingIndicator';
import { appDimensions } from '#/styles/dimensions';
import WithAppStatusItemContext from '#/hooks/ap-proto/useAppStatusItem';
import StatusItem from '#/components/common/status/StatusItem';
import Animated from 'react-native-reanimated';
import useAutoHideTopNavOnScroll from '#/hooks/anim/useAutoHideTopNavOnScroll';

type TimelinePostListViewProps = {
	items: PostObjectType[];
	numItems: number;
	loadMore: () => void;
	fetching: boolean;
	onRefresh: () => void;
	refreshing: boolean;
};

function TimelinePostListView({
	numItems,
	items,
	loadMore,
	fetching,
	onRefresh,
	refreshing,
}: TimelinePostListViewProps) {
	const { theme } = useAppTheme();

	function onEndReached() {
		if (numItems > 0 && !fetching && !refreshing) {
			console.log('loading more...');
			loadMore();
		}
	}
	const { scrollHandler, animatedStyle } =
		useAutoHideTopNavOnScroll(onEndReached);

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: theme.palette.bg,
				},
			]}
		>
			<Animated.View style={[styles.header, animatedStyle]}>
				<TimelinesHeader />
			</Animated.View>

			<View style={{ flex: 1 }}>
				<Animated.FlatList
					data={items}
					renderItem={({ item }) => (
						<WithAppStatusItemContext dto={item}>
							<StatusItem />
						</WithAppStatusItemContext>
					)}
					onScroll={scrollHandler}
					contentContainerStyle={{
						paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 16,
					}}
					scrollEventThrottle={16}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
				/>
			</View>
			<TimelineLoadingIndicator
				networkFetchStatus={fetching ? 'fetching' : 'idle'}
			/>
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
