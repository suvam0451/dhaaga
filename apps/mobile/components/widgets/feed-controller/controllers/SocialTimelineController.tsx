import { memo } from 'react';
import { View, Text } from 'react-native';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { styles } from './_shared';

const SocialTimelineController = memo(function Foo() {
	const { subdomain } = useActivityPubRestClientContext();
	return (
		<View>
			<Text style={styles.timelineTypeText}>Your Social Timeline</Text>
			<Text style={styles.timelineTargetText}>{subdomain}</Text>
			<Text style={styles.timelineDescription}>
				This timeline has posts from your friends and other users from your
				server.
			</Text>
		</View>
	);
});

export default SocialTimelineController;
