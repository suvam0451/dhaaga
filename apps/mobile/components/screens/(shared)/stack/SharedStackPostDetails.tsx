import StatusItem from '../../../common/status/StatusItem';
import { Fragment, useMemo, useState } from 'react';
import { Animated, RefreshControl, View, Text, FlatList } from 'react-native';
import WithAutoHideTopNavBar from '../../../containers/WithAutoHideTopNavBar';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import { useLocalSearchParams } from 'expo-router';
import WithAppStatusItemContext from '../../../../hooks/ap-proto/useAppStatusItem';
import useGetStatusCtxInterface from '../../../../hooks/api/statuses/useGetStatusCtxInterface';
import WithAppStatusContextDataContext, {
	useAppStatusContextDataContext,
} from '../../../../hooks/api/statuses/WithAppStatusContextData';
import PostReply from '../../../common/status/PostReply';
import { APP_FONT } from '../../../../styles/AppTheme';
import WithAppTimelineDataContext from '../../../../hooks/app/timelines/useAppTimelinePosts';
import { AppDivider } from '../../../lib/Divider';
import { APP_FONTS } from '../../../../styles/AppFonts';
import { useAppTheme } from '../../../../hooks/utility/global-state-extractors';

function ReplySection() {
	const { theme } = useAppTheme();
	return (
		<Fragment>
			<View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
				<Text
					style={{
						fontFamily: APP_FONTS.INTER_600_SEMIBOLD,
						color: theme.secondary.a20,
						fontSize: 18,
					}}
				>
					Replies
				</Text>
			</View>
			<AppDivider.Soft style={{ marginVertical: 16 }} />
		</Fragment>
	);
}

function StatusContextComponent() {
	const { data, getChildren } = useAppStatusContextDataContext();
	const children = useMemo(() => {
		return getChildren(data.root);
	}, [data]);

	if (!data.root) return <View />;

	const rootObject = data.lookup.get(data.root);

	return (
		<View>
			<WithAppStatusItemContext dto={rootObject}>
				<StatusItem showFullDetails />
			</WithAppStatusItemContext>
			<ReplySection />
			<FlatList
				data={children}
				renderItem={({ item }) => <PostReply lookupId={item.id} />}
			/>
			<View style={{ marginVertical: 16 }}>
				<Text style={{ textAlign: 'center', color: APP_FONT.MONTSERRAT_BODY }}>
					No more replies
				</Text>
			</View>
		</View>
	);
}

function SharedStackPostDetails() {
	const [refreshing, setRefreshing] = useState(false);

	const { id, uri } = useLocalSearchParams<{ id: string; uri: string }>();
	const { Data, dispatch, refetch } = useGetStatusCtxInterface(
		id === 'uri' ? uri : id,
	);

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	return (
		<WithAutoHideTopNavBar title={'Post'} translateY={translateY}>
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

export default SharedStackPostDetails;
