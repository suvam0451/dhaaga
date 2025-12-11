import { useAppStatusContextDataContext } from '#/hooks/api/statuses/WithAppStatusContextData';
import { useMemo, useState } from 'react';
import { Animated, RefreshControl, View } from 'react-native';
import { RefetchOptions } from '@tanstack/react-query';
import { appDimensions } from '#/styles/dimensions';
import WithAppStatusItemContext from '#/components/containers/contexts/WithPostItemContext';
import StatusItem from '#/features/post-item/PostTimelineEntryView';
import PostCommentThreadControls from '../posts/features/detail-view/presenters/PostCommentThreadControls';
import ReplyItemPresenter from '../posts/features/detail-view/presenters/ReplyItemPresenter';
import NoMoreReplies from '../posts/features/detail-view/components/NoMoreReplies';
import NavBar_Simple from '#/components/shared/topnavbar/NavBar_Simple';
import useScrollHandleAnimatedList from '#/hooks/anim/useScrollHandleAnimatedList';

type Props = {
	refetch: (options?: RefetchOptions) => Promise<any>;
};

function PostDetailPresenter({ refetch }: Props) {
	const [Refreshing, setRefreshing] = useState(false);

	const { data, getChildren } = useAppStatusContextDataContext();
	const children = useMemo(() => {
		return getChildren(data.root);
	}, [data]);

	const { scrollHandler, animatedStyle } = useScrollHandleAnimatedList();

	const rootObject = data.lookup.get(data.root);

	function onRefresh() {
		setRefreshing(true);
		refetch().finally(() => {
			setRefreshing(false);
		});
	}

	return (
		<>
			<NavBar_Simple label={'Post Details'} animatedStyle={animatedStyle} />
			<Animated.FlatList
				data={children}
				renderItem={({ item }) => (
					<ReplyItemPresenter colors={[]} lookupId={item.id} />
				)}
				refreshControl={
					<RefreshControl refreshing={Refreshing} onRefresh={onRefresh} />
				}
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 4,
				}}
				onScroll={scrollHandler}
				ListHeaderComponent={
					<>
						<WithAppStatusItemContext dto={rootObject}>
							<StatusItem showFullDetails />
						</WithAppStatusItemContext>
						<PostCommentThreadControls count={children.length} />
					</>
				}
				ListEmptyComponent={<View />}
				ListFooterComponent={<NoMoreReplies />}
			/>
		</>
	);
}

export default PostDetailPresenter;
