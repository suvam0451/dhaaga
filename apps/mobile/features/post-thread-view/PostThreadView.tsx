import { PostThreadCtx } from '@dhaaga/react';
import { useAppTheme } from '#/states/global/hooks';
import useApiBuildPostThread from '#/hooks/api/useApiBuildPostThread';
import useScrollHandleAnimatedList from '#/hooks/anim/useScrollHandleAnimatedList';
import NavBar_Simple from '#/features/navbar/views/NavBar_Simple';
import PostCommentThreadControls from '#/features/post-thread-view/views/PostCommentThreadControls';
import { appDimensions } from '#/styles/dimensions';
import { AppDividerSoft } from '#/ui/Divider';
import NoMoreReplies from '#/features/post-thread-view/components/NoMoreReplies';
import { FlatList, RefreshControl, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import TimelinePostItemView from '#/features/post-item-view/TimelinePostItemView';
import TimelineStateIndicator from '#/features/timelines/components/TimelineStateIndicator';
import ThreadRootReplyView from '#/features/post-thread-view/views/ThreadRootReplyView';

function ContentView() {
	const { theme } = useAppTheme();
	const [Refreshing, setRefreshing] = useState(false);
	const { id, uri } = useLocalSearchParams<{ id: string; uri: string }>();
	const { refetch, error, isFetching, items } = useApiBuildPostThread(
		id === 'uri' ? uri : id,
	);

	const { scrollHandler, animatedStyle } = useScrollHandleAnimatedList();

	function onRefresh() {
		setRefreshing(true);
		refetch().finally(() => {
			setRefreshing(false);
		});
	}

	const [ContainerHeight, setContainerHeight] = useState(0);
	function onLayout(event: any) {
		setContainerHeight(event.nativeEvent.layout.height);
	}

	return (
		<View style={{ flex: 1, backgroundColor: theme.background.a0 }}>
			<NavBar_Simple label={'Post Details'} animatedStyle={animatedStyle} />
			<FlatList
				onLayout={onLayout}
				data={items}
				renderItem={({ item }) => {
					switch (item.type) {
						case 'history':
							return <View></View>;
						case 'anchor':
							return (
								<>
									<TimelinePostItemView post={item.post} showFullDetails />
									<PostCommentThreadControls count={0} />
								</>
							);
						case 'reply':
							return <ThreadRootReplyView postId={item.post.id} />;
					}
					return <View />;
				}}
				refreshControl={
					<RefreshControl refreshing={Refreshing} onRefresh={onRefresh} />
				}
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 4,
				}}
				onScroll={scrollHandler}
				ListEmptyComponent={
					<TimelineStateIndicator
						queryResult={{
							error,
							isFetched: !isFetching,
							isRefetching: isFetching,
						}}
						containerHeight={ContainerHeight}
						itemType={'post-thread'}
						numItems={items.length}
					/>
				}
				ItemSeparatorComponent={() => (
					<AppDividerSoft style={{ marginVertical: 8 }} />
				)}
				ListFooterComponent={items.length > 0 ? <NoMoreReplies /> : <View />}
			/>
		</View>
	);
}

function PostThreadView() {
	return (
		<PostThreadCtx>
			<ContentView />
		</PostThreadCtx>
	);
}

export default PostThreadView;
