import { memo } from 'react';
import { View, Text } from 'react-native';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { styles } from './_shared';

const BubbleTimelineController = memo(function Foo() {
	const { subdomain } = useActivityPubRestClientContext();
	return (
		<View>
			<Text style={styles.timelineTypeText}>Bubble Timeline</Text>
			<Text style={styles.timelineTargetText}>{subdomain}</Text>
			<Text style={styles.timelineDescription}>
				This timeline displays posts from a list of servers curated by your
				instance admin
			</Text>
		</View>
	);
});

export default BubbleTimelineController;
