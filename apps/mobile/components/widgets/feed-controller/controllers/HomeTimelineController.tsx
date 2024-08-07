import { memo } from 'react';
import { View, Text } from 'react-native';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { styles } from './_shared';

const HomeTimelineController = memo(function Foo() {
	const { subdomain } = useActivityPubRestClientContext();
	return (
		<View>
			<Text style={styles.timelineTypeText}>Your Home Timeline</Text>
			<Text style={styles.timelineTargetText}>{subdomain}</Text>
			<Text style={styles.timelineDescription}>
				This timeline displays post from you and your friends
			</Text>
		</View>
	);
});

export default HomeTimelineController;
