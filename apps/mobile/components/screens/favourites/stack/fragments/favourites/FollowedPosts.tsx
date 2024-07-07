import { useQuery } from '@tanstack/react-query';
import { useActivityPubRestClientContext } from '../../../../../../states/useActivityPubRestClient';
import { View } from 'react-native';
import StatusItem from '../../../../../common/status/StatusItem';
import WithActivitypubStatusContext from '../../../../../../states/useStatus';
import { StatusArray } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/status/_interface';

function FollowedPosts() {
	const { client } = useActivityPubRestClientContext();

	async function api() {
		if (!client) throw new Error('_client not initialized');
		return await client.getFavourites({
			limit: 5,
		});
	}

	// Queries
	const { data, refetch } = useQuery<StatusArray>({
		queryKey: ['favourites'],
		queryFn: api,
		enabled: client !== null,
	});

	return (
		<View>
			{data &&
				data.map((o, i) => (
					<WithActivitypubStatusContext status={o} key={i}>
						<StatusItem />
					</WithActivitypubStatusContext>
				))}
		</View>
	);
}

export default FollowedPosts;
