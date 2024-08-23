import StatusItem from '../../components/common/status/StatusItem';
import { useMemo, useState } from 'react';
import { Animated, RefreshControl, View, Text } from 'react-native';
import WithAutoHideTopNavBar from '../../components/containers/WithAutoHideTopNavBar';
import useScrollMoreOnPageEnd from '../../states/useScrollMoreOnPageEnd';
import { useLocalSearchParams } from 'expo-router';
import WithAppStatusItemContext from '../../hooks/ap-proto/useAppStatusItem';
import useGetStatusContext from '../../hooks/api/statuses/useGetStatusContext';
import WithAppStatusContextDataContext, {
	useAppStatusContextDataContext,
} from '../../hooks/api/statuses/WithAppStatusContextData';
import PostReply from '../../components/common/status/PostReply';
import { APP_FONT } from '../../styles/AppTheme';
import WithAppTimelineDataContext from '../../components/common/timeline/api/useTimelineData';

function StatusContextComponent() {
	const { data } = useAppStatusContextDataContext();
	const children = useMemo(() => {
		const childrenIds = data.children.get(data.root);
		if (!childrenIds) return [];
		return childrenIds
			.map((o) => data.lookup.get(o))
			.filter((o) => o !== undefined && o !== null);
	}, [data]);

	if (!data.root) return <View></View>;

	return (
		<View>
			{data.root && (
				<WithAppStatusItemContext dto={data.lookup.get(data.root)}>
					<StatusItem />
				</WithAppStatusItemContext>
			)}
			{children.map((o) => (
				<PostReply lookupId={o.id} />
			))}
			<View style={{ marginVertical: 16 }}>
				<Text style={{ textAlign: 'center', color: APP_FONT.MONTSERRAT_BODY }}>
					No more replies
				</Text>
			</View>
		</View>
	);
}

function Post() {
	const [refreshing, setRefreshing] = useState(false);

	const { id } = useLocalSearchParams<{ id: string }>();
	const { Data, dispatch, refetch } = useGetStatusContext(id);

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	return (
		<WithAutoHideTopNavBar title={'' + 'Post Details'} translateY={translateY}>
			<WithAppStatusContextDataContext data={Data} dispatch={dispatch}>
				<WithAppTimelineDataContext>
					<Animated.ScrollView
						refreshControl={
							<RefreshControl refreshing={refreshing} onRefresh={refetch} />
						}
						contentContainerStyle={{ paddingTop: 54 }}
						onScroll={onScroll}
					>
						<StatusContextComponent />
					</Animated.ScrollView>
				</WithAppTimelineDataContext>
			</WithAppStatusContextDataContext>
		</WithAutoHideTopNavBar>
	);
}

export default Post;
