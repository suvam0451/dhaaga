import { memo } from 'react';
import { useTimelineController } from '../../../../states/useTimelineController';
import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { styles } from './_shared';

const ListTimelineController = memo(function Foo() {
	const { query } = useTimelineController();

	return (
		<View>
			<Text style={styles.timelineTypeText}>Hashtag Timeline</Text>
			<Text style={styles.timelineTargetText}>{query?.label}</Text>
		</View>
	);
});

export default ListTimelineController;
