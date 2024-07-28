import { memo } from 'react';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { View, Text } from 'react-native';
import { styles } from './_shared';

const FederatedTimelineController = memo(function Foo() {
	const { subdomain } = useActivityPubRestClientContext();
	return (
		<View>
			<Text style={styles.timelineTypeText}>Your Server's Public Timeline</Text>
			<Text style={styles.timelineTargetText}>{subdomain}</Text>
			<Text style={styles.timelineDescription}>
				This timeline displays every post fetched by your instance
			</Text>
		</View>
	);
});

export default FederatedTimelineController;
