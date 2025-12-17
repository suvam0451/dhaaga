import { PostThreadCtx } from '@dhaaga/react';
import { useAppTheme } from '#/states/global/hooks';
import ErrorPageBuilder from '#/ui/ErrorPageBuilder';
import BearError from '#/components/svgs/BearError';
import useApiBuildPostThread from '#/hooks/api/useApiBuildPostThread';
import useScrollHandleAnimatedList from '#/hooks/anim/useScrollHandleAnimatedList';
import NavBar_Simple from '#/components/topnavbar/NavBar_Simple';
import WithAppStatusItemContext from '#/components/containers/WithPostItemContext';
import StatusItem from '#/features/post-item/PostTimelineEntryView';
import PostCommentThreadControls from '#/features/posts/features/detail-view/presenters/PostCommentThreadControls';
import PostReplyItem from '#/features/posts/features/detail-view/presenters/ReplyItemPresenter';
import { appDimensions } from '#/styles/dimensions';
import { AppDividerSoft } from '#/ui/Divider';
import NoMoreReplies from '#/features/posts/features/detail-view/components/NoMoreReplies';
import { RefreshControl, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import Animated from 'react-native-reanimated';

type StateIndicatorProps = {
	error?: Error;
	isFetching?: boolean;
};

function StateIndicator({ error, isFetching }: StateIndicatorProps) {
	const { theme } = useAppTheme();
	if (error) {
		return (
			<View
				style={{
					flex: 1,
					backgroundColor: theme.palette.bg,
					paddingTop: 52,
				}}
			>
				<ErrorPageBuilder
					stickerArt={<BearError />}
					errorMessage={'Failed to load thread'}
					errorDescription={error?.toString()}
				/>
			</View>
		);
	} else if (isFetching) {
		return <View />;
	} else {
		return <View />;
	}
}

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

	return (
		<View style={{ flex: 1, backgroundColor: theme.background.a0 }}>
			<NavBar_Simple label={'Post Details'} animatedStyle={animatedStyle} />
			<Animated.FlatList
				data={items}
				renderItem={({ item }) => {
					switch (item.type) {
						case 'history':
							return <View></View>;
						case 'anchor':
							return (
								<>
									<WithAppStatusItemContext dto={item.post}>
										<StatusItem showFullDetails />
									</WithAppStatusItemContext>
									<PostCommentThreadControls count={0} />
								</>
							);
						case 'reply':
							return <PostReplyItem colors={[]} postId={item.post.id} />;
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
					<StateIndicator error={error} isFetching={isFetching} />
				}
				ItemSeparatorComponent={() => (
					<AppDividerSoft style={{ marginVertical: 8 }} />
				)}
				ListFooterComponent={items.length > 0 ? <NoMoreReplies /> : <View />}
				maxToRenderPerBatch={10}
				initialNumToRender={16}
				windowSize={7}
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
