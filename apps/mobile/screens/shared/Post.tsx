import StatusItem from '../../components/common/status/StatusItem';
import { useEffect, useMemo, useState } from 'react';
import {
	ActivityPubStatus,
	LibraryResponse,
} from '@dhaaga/shared-abstraction-activitypub';
import { useQuery } from '@tanstack/react-query';
import { useActivityPubRestClientContext } from '../../states/useActivityPubRestClient';
import WithActivitypubStatusContext, {
	useActivitypubStatusContext,
} from '../../states/useStatus';
import { Animated, RefreshControl, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import WithAutoHideTopNavBar from '../../components/containers/WithAutoHideTopNavBar';
import useScrollMoreOnPageEnd from '../../states/useScrollMoreOnPageEnd';
import PostReply from '../../components/common/status/PostReply';
import { Text } from '@rneui/themed';
import { APP_FONT } from '../../styles/AppTheme';
import { useLocalSearchParams, useNavigation } from 'expo-router';

type StatusContextReplyItemProps = {
	lookupId: string;
};

function StatusContextReplyItem({ lookupId }: StatusContextReplyItemProps) {
	const { contextItemLookup } = useActivitypubStatusContext();

	const root = useMemo(() => {
		return contextItemLookup.current.get(lookupId);
	}, [lookupId]);

	return (
		<WithActivitypubStatusContext statusInterface={root}>
			<StatusItem />
		</WithActivitypubStatusContext>
	);
}

function StatusContextComponent() {
	const { contextChildrenLookup, contextRootLookup, stateKey } =
		useActivitypubStatusContext();

	const root = useMemo(() => {
		return contextRootLookup.current;
	}, [stateKey]);

	const children = useMemo(() => {
		const root = contextRootLookup.current;
		if (!root || !contextChildrenLookup.current) return [];
		return contextChildrenLookup.current?.get(root.getId()) || [];
	}, [stateKey]);

	if (!root) return <View></View>;

	return (
		<View>
			{root && (
				<WithActivitypubStatusContext statusInterface={root}>
					<StatusItem />
				</WithActivitypubStatusContext>
			)}
			{children?.map((o, i) => <PostReply key={i} lookupId={o.getId()} />)}
			<View style={{ marginVertical: 16 }}>
				<Text style={{ textAlign: 'center', color: APP_FONT.MONTSERRAT_BODY }}>
					No more replies
				</Text>
			</View>
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
	const { id } = useLocalSearchParams<{ id: string }>();
	const [refreshing, setRefreshing] = useState(false);
	const { client } = useActivityPubRestClientContext();

	async function queryFn() {
		if (!client) throw new Error('_client not initialized');
		return await client.statuses.get(id);
	}

	const { status, data, fetchStatus, refetch } = useQuery<
		LibraryResponse<ActivityPubStatus>
	>({
		queryKey: [id],
		queryFn,
		enabled: client && id !== undefined,
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

	return (
		<WithAutoHideTopNavBar title={'Post Details'} translateY={translateY}>
			{data && (
				<WithActivitypubStatusContext status={data.data} key={0}>
					<Animated.ScrollView
						refreshControl={
							<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
						}
						contentContainerStyle={{ paddingTop: 54 }}
						onScroll={onScroll}
					>
						<StatusContextApiWrapper />
					</Animated.ScrollView>
				</WithActivitypubStatusContext>
			)}
		</WithAutoHideTopNavBar>
	);
}

export default Post;
