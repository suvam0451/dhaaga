import { useAppStatusContextDataContext } from '#/hooks/api/statuses/WithAppStatusContextData';
import { useMemo, useState } from 'react';
import { Animated, FlatList, RefreshControl, View } from 'react-native';
import WithAutoHideTopNavBar from '#/components/containers/WithAutoHideTopNavBar';
import useScrollMoreOnPageEnd from '#/states/useScrollMoreOnPageEnd';
import { RefetchOptions } from '@tanstack/react-query';
import { appDimensions } from '#/styles/dimensions';
import WithAppStatusItemContext from '#/components/containers/contexts/WithPostItemContext';
import StatusItem from '#/features/post-item/PostTimelineEntryView';
import PostCommentThreadControls from './PostCommentThreadControls';
import ReplyItemPresenter from './ReplyItemPresenter';
import NoMoreReplies from '../components/NoMoreReplies';

type Props = {
	refetch: (options?: RefetchOptions) => Promise<any>;
};

function PostDetailPresenter({ refetch }: Props) {
	const [Refreshing, setRefreshing] = useState(false);

	const { data, getChildren } = useAppStatusContextDataContext();
	const children = useMemo(() => {
		return getChildren(data.root);
	}, [data]);

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
		loadNextPage: () => {},
	});

	if (!data.root)
		return (
			<WithAutoHideTopNavBar title={'Post'} translateY={translateY}>
				<View />
			</WithAutoHideTopNavBar>
		);

	const rootObject = data.lookup.get(data.root);

	function onRefresh() {
		setRefreshing(true);
		refetch().finally(() => {
			setRefreshing(false);
		});
	}

	return (
		<WithAutoHideTopNavBar title={'Post'} translateY={translateY}>
			<Animated.ScrollView
				refreshControl={
					<RefreshControl refreshing={Refreshing} onRefresh={onRefresh} />
				}
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 4,
				}}
				onScroll={onScroll}
			>
				<WithAppStatusItemContext dto={rootObject}>
					<StatusItem showFullDetails />
				</WithAppStatusItemContext>
				<PostCommentThreadControls count={children.length} />
				<FlatList
					data={children}
					renderItem={({ item }) => (
						<ReplyItemPresenter colors={[]} lookupId={item.id} />
					)}
				/>
				<NoMoreReplies />
			</Animated.ScrollView>
		</WithAutoHideTopNavBar>
	);
}

export default PostDetailPresenter;
