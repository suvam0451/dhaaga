import { memo, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@rneui/themed';
import Ionicons from '@expo/vector-icons/Ionicons';
import { APP_FONT } from '../../../../styles/AppTheme';
import usePinnedPosts from '../api/usePinnedPosts';
import WithAppTimelineDataContext, {
	useAppTimelineDataContext,
} from '../../timeline/api/useTimelineData';
import FlashListPosts from '../../../shared/flash-lists/FlashListPosts';

type Props = {
	userId: string;
};

function Core({ userId }: Props) {
	const [IsVisible, setIsVisible] = useState(false);
	const { Data } = usePinnedPosts(userId);
	const { addPosts, listItems, clear } = useAppTimelineDataContext();

	useEffect(() => {
		clear();
	}, [userId]);

	useEffect(() => {
		addPosts(Data);
	}, [Data]);

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
				<FlashListPosts data={listItems} paddingTop={0} />
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

const PinnedPosts = memo(({ userId }: Props) => {
	return (
		<WithAppTimelineDataContext>
			<Core userId={userId} />
		</WithAppTimelineDataContext>
	);
});

export default PinnedPosts;
