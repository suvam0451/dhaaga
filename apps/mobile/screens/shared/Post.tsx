import TitleOnlyStackHeaderContainer from '../../components/containers/TitleOnlyStackHeaderContainer';
import StatusItem from '../../components/common/status/StatusItem';
import { useEffect, useState } from 'react';
import { ActivityPubStatus } from '@dhaaga/shared-abstraction-activitypub/src';
import { useQuery } from '@tanstack/react-query';
import { useActivityPubRestClientContext } from '../../states/useActivityPubRestClient';
import WithActivitypubStatusContext, {
	useActivitypubStatusContext,
} from '../../states/useStatus';
import Animated from 'react-native-reanimated';
import { RefreshControl, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import WithAutoHideTopNavBar from '../../components/containers/WithAutoHideTopNavBar';
import useLoadingMoreIndicatorState from '../../states/useLoadingMoreIndicatorState';
import useScrollMoreOnPageEnd from '../../states/useScrollMoreOnPageEnd';
import usePageRefreshIndicatorState from '../../states/usePageRefreshIndicatorState';

function StatusContextComponent() {
	const { statusContext } = useActivitypubStatusContext();

	// TODO: fix the context items giving error
	useEffect(() => {
		console.log('[INFO]: found context items', statusContext);
	}, [statusContext]);

	return (
		<View>
			<StatusItem />
			{/*{statusContext.getChildren().map((o) =>*/}
			{/*    <WithActivitypubStatusContext statusInterface={o}>*/}
			{/*      <StatusItem hideReplyIndicator={true}*/}
			{/*                  replyContextIndicators={["red"]}/>*/}
			{/*    </WithActivitypubStatusContext>*/}
			{/*)}*/}
		</View>
	);
}

function StatusContextApiWrapper() {
	const route = useRoute<any>();
	const q = route?.params?.id;
	const { client } = useActivityPubRestClientContext();
	const { setStatusContextData } = useActivitypubStatusContext();

	async function api() {
		if (!client) throw new Error('_client not initialized');
		return await client.getStatusContext(q);
	}

	const { status, data, fetchStatus } = useQuery<ActivityPubStatus>({
		queryKey: ['mastodon/context', q],
		queryFn: api,
		enabled: client && q !== undefined,
	});

	useEffect(() => {
		if (status === 'success') {
			setStatusContextData(data);
		}
	}, [status, fetchStatus]);

	return <StatusContextComponent />;
}

function Post() {
	const navigation = useNavigation();
	const route = useRoute<any>();
	const q = route?.params?.id;

	const [refreshing, setRefreshing] = useState(false);
	const { client } = useActivityPubRestClientContext();

	async function queryFn() {
		if (!client) throw new Error('_client not initialized');

		return await client.getStatus(q);
	}

	const { status, data, error, fetchStatus, refetch } =
		useQuery<ActivityPubStatus>({
			queryKey: ['mastodon/statuses', q],
			queryFn,
			enabled: client && q !== undefined,
		});

	useEffect(() => {
		if (status === 'success') {
			setRefreshing(false);
		}
	}, [status, fetchStatus]);

	function onRefresh() {
		refetch();
	}

	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	// console.log(data);
	return (
		<WithAutoHideTopNavBar title={'Post Details'} translateY={translateY}>
			{data && (
				<WithActivitypubStatusContext status={data} key={0}>
					<Animated.ScrollView
						refreshControl={
							<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
						}
						contentContainerStyle={{ paddingTop: 54 }}
					>
						<StatusContextApiWrapper />
					</Animated.ScrollView>
				</WithActivitypubStatusContext>
			)}
		</WithAutoHideTopNavBar>
	);
}

export default Post;
