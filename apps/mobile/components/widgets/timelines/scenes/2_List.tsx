import { useQuery } from '@tanstack/react-query';
import { mastodon } from '@dhaaga/shared-provider-mastodon';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { TouchableOpacity, View } from 'react-native';
import TimelineLoading from '../../../loading-screens/TimelineLoading';
import { Text } from '@rneui/themed';
import { APP_FONT } from '../../../../styles/AppTheme';
import {
	TimelineFetchMode,
	useTimelineControllerContext,
} from '../../../../states/useTimelineController';

function ListTimelineOptions() {
	const { client, primaryAcct } = useActivityPubRestClientContext();
	const username = primaryAcct.username;
	const subdomain = primaryAcct.subdomain;
	const { setTimelineType, setQueryOptions, setShowTimelineSelection } =
		useTimelineControllerContext();

	async function api() {
		if (!client) throw new Error('_client not initialized');

		return client.getMyLists();
	}

	// Queries
	const { status, data, refetch, fetchStatus } = useQuery<mastodon.v1.List[]>({
		queryKey: ['lists', username, subdomain],
		queryFn: api,
		enabled: client !== null,
	});

	if (fetchStatus === 'fetching') {
		return <TimelineLoading label={'Loading Your Lists'} />;
	}

	function onListSelected(idx: number) {
		setQueryOptions({ listId: data[idx].id });
		setTimelineType(TimelineFetchMode.LIST);
		setShowTimelineSelection(false);
	}

	return (
		<View style={{ padding: 8, paddingTop: 8 }}>
			<Text
				style={{
					fontFamily: 'Montserrat-Bold',
					color: APP_FONT.MONTSERRAT_BODY,
					marginVertical: 8,
				}}
			>
				Your lists:
			</Text>
			{data.map((o, i) => (
				<TouchableOpacity
					key={i}
					style={{
						marginHorizontal: 0,
						backgroundColor: '#383838',
						padding: 10,
						borderRadius: 8,
						marginVertical: 4,
					}}
					onPress={() => {
						onListSelected(i);
					}}
				>
					<Text
						style={{
							fontFamily: 'Montserrat-Bold',
							color: APP_FONT.MONTSERRAT_BODY,
						}}
					>
						{o.title}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);
}

export default ListTimelineOptions;
