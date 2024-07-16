import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { useQuery } from '@tanstack/react-query';
import { ActivityPubStatuses } from '@dhaaga/shared-abstraction-activitypub';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@rneui/themed';
import Ionicons from '@expo/vector-icons/Ionicons';
import { APP_FONT } from '../../../../styles/AppTheme';
import WithActivitypubStatusContext from '../../../../states/useStatus';
import StatusItem from '../../status/StatusItem';
import ActivityPubAdapterService from '../../../../services/activitypub-adapter.service';
import { AnimatedFlashList } from '@shopify/flash-list';

type Props = {
	userId: string;
};

function PinnedPosts({ userId }: Props) {
	const [IsVisible, setIsVisible] = useState(false);
	const { client, domain } = useActivityPubRestClientContext();
	const [Data, setData] = useState([]);

	useEffect(() => {
		setData([]);
	}, [userId]);

	async function fn() {
		const { data, error } = (await client.accounts.statuses(userId, {
			limit: 20,
			pinned: true,
			userId,
		})) as any;
		if (error) return [];
		return data;
	}

	// Post Queries
	const { status, data, fetchStatus } = useQuery<ActivityPubStatuses>({
		queryKey: [userId],
		queryFn: fn,
		enabled: userId !== undefined,
	});

	useEffect(() => {
		if (status !== 'success' || data === undefined) return;
		/**
		 * Masto.js returns the account first,
		 * then the status array. Pretty weird.
		 */
		if (!Array.isArray(data)) return;

		setData(
			ActivityPubAdapterService.adaptManyStatuses(data, domain).slice(0, 5),
		);
	}, [fetchStatus]);

	return (
		<View style={{ paddingHorizontal: 8 }}>
			<TouchableOpacity
				onPress={() => {
					setIsVisible((o) => !o);
				}}
			>
				<View style={styles.expandableSectionMarkerContainer}>
					<Text style={styles.collapsibleProfileSectionText}>
						Pinned Posts{' '}
						<Text style={{ color: APP_FONT.MONTSERRAT_BODY }}>
							({Data.length})
						</Text>
					</Text>
					<Ionicons
						name={IsVisible ? 'chevron-down' : 'chevron-forward'}
						size={24}
						color={APP_FONT.MONTSERRAT_BODY}
					/>
				</View>
			</TouchableOpacity>
			<View style={{ display: IsVisible ? 'flex' : 'none' }}>
				<AnimatedFlashList
					estimatedItemSize={200}
					data={Data}
					renderItem={({ item }) => (
						<WithActivitypubStatusContext statusInterface={item}>
							<StatusItem />
						</WithActivitypubStatusContext>
					)}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		position: 'absolute',
		backgroundColor: '#1c1c1c',
		left: 0,
		right: 0,
		width: '100%',
		zIndex: 1,
	},
	expandableSectionMarkerContainer: {
		marginVertical: 6,
		paddingTop: 8,
		paddingBottom: 8,
		paddingLeft: 16,
		paddingRight: 16,
		backgroundColor: '#272727',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 8,
	},
	collapsibleProfileSectionText: {
		color: APP_FONT.MONTSERRAT_BODY,
		fontFamily: 'Montserrat-Bold',
		flexGrow: 1,
	},
});

export default PinnedPosts;
