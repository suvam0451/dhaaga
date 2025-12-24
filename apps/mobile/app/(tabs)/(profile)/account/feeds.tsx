import { Pressable, RefreshControl, View, StyleSheet } from 'react-native';
import useApiGetMyFeeds from '#/hooks/api/useFeeds';
import { appDimensions } from '#/styles/dimensions';
import type { FeedObjectType } from '@dhaaga/bridge';
import { AppIcon } from '#/components/lib/Icon';
import { Image } from 'expo-image';
import { useAppTheme } from '#/states/global/hooks';
import NavBar_Simple from '#/features/navbar/views/NavBar_Simple';
import { useState } from 'react';
import { NativeTextBold, NativeTextSpecial } from '#/ui/NativeText';
import { LegendList } from '@legendapp/list';
import useScrollHandleFlatList from '#/hooks/anim/useScrollHandleFlatList';
import { AppDividerHard } from '#/ui/Divider';
import RoutingUtils from '#/utils/routing.utils';
import TimelineStateIndicator from '#/features/timelines/components/TimelineStateIndicator';

type MyFeedItemProps = {
	item: FeedObjectType;
};

function MyFeedItem({ item }: MyFeedItemProps) {
	function onPress() {
		RoutingUtils.browseFeed(item?.uri, item?.displayName);
	}

	return (
		<Pressable style={styles.itemRoot} onPress={onPress}>
			<View>
				<Image
					source={{ uri: item?.avatar }}
					style={{ width: 36, height: 36, borderRadius: 8 }}
				/>
			</View>
			<View style={{ flexGrow: 1, marginLeft: 8 }}>
				<NativeTextBold style={{ fontSize: 18 }}>
					{item.displayName}
				</NativeTextBold>
			</View>

			<View style={{ width: 24 }}>
				<AppIcon id={'chevron-right'} />
			</View>
		</Pressable>
	);
}

function Page() {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { theme } = useAppTheme();
	const queryResult = useApiGetMyFeeds();
	const { data, refetch } = queryResult;
	const { scrollHandler, animatedStyle } = useScrollHandleFlatList();

	function onRefresh() {
		setIsRefreshing(true);
		refetch().finally(() => setIsRefreshing(false));
	}

	const [ContainerHeight, setContainerHeight] = useState(0);
	function onLayout(event: any) {
		setContainerHeight(event.nativeEvent.layout.height);
	}

	return (
		<>
			<NavBar_Simple label={'My Feeds'} animatedStyle={animatedStyle} />
			<LegendList
				key={'my/feeds'}
				keyExtractor={(item) => item.uri}
				onLayout={onLayout}
				data={data ?? []}
				renderItem={({ item }) => <MyFeedItem item={item} />}
				onScroll={scrollHandler}
				ListHeaderComponent={
					<NativeTextSpecial
						style={{
							fontSize: 32,
							marginHorizontal: 10,
							marginVertical: appDimensions.timelines.sectionBottomMargin * 3,
						}}
					>
						My Subscribed Feeds
					</NativeTextSpecial>
				}
				contentContainerStyle={{
					marginTop: appDimensions.topNavbar.scrollViewTopPadding,
					paddingBottom: appDimensions.bottomNav.secondMenuBarHeight + 16,
				}}
				style={{ backgroundColor: theme.background.a0 }}
				ListEmptyComponent={
					<TimelineStateIndicator
						itemType={'feed'}
						containerHeight={ContainerHeight}
						queryResult={queryResult}
						numItems={data?.length ?? 0}
					/>
				}
				progressViewOffset={appDimensions.topNavbar.scrollViewTopPadding}
				refreshControl={
					<RefreshControl refreshing={IsRefreshing} onRefresh={onRefresh} />
				}
				ItemSeparatorComponent={() => (
					<AppDividerHard
						style={{ marginVertical: 8, backgroundColor: theme.background.a50 }}
					/>
				)}
			/>
		</>
	);
}

export default Page;

const styles = StyleSheet.create({
	itemRoot: {
		flexDirection: 'row',
		width: '100%',
		paddingVertical: 4,
		alignItems: 'center',
		paddingHorizontal: 10,
	},
});
