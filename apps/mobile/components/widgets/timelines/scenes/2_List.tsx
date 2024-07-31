import { useQuery } from '@tanstack/react-query';
import { mastodon } from '@dhaaga/shared-provider-mastodon';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { TouchableOpacity, View } from 'react-native';
import TimelineLoading from '../../../loading-screens/TimelineLoading';
import { Text } from '@rneui/themed';
import { APP_FONT } from '../../../../styles/AppTheme';
import { useTimelineController } from '../../../common/timeline/api/useTimelineController';
import { TimelineFetchMode } from '../../../common/timeline/utils/timeline.types';

function ListTimelineOptions() {
	const { client, primaryAcct } = useActivityPubRestClientContext();
	const username = primaryAcct.username;
	const subdomain = primaryAcct.subdomain;
	const { setTimelineType, setQuery, setShowTimelineSelection } =
		useTimelineController();

	async function api() {
		if (!client) throw new Error('_client not initialized');

		return client.getMyLists();
	}

	// Queries
	const { data, fetchStatus } = useQuery<mastodon.v1.List[]>({
		queryKey: [username, subdomain],
		queryFn: api,
		enabled: client !== null,
	});

	if (fetchStatus === 'fetching') {
		return <TimelineLoading label={'Loading Your Lists'} />;
	}

	function onListSelected(idx: number) {
		setQuery({ id: data[idx].id, label: data[idx].title });
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
