import { memo } from 'react';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { View, Text } from 'react-native';
import { styles } from './_shared';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';

const FederatedTimelineController = memo(function Foo() {
	const { domain, subdomain } = useActivityPubRestClientContext();
	const mainText = [KNOWN_SOFTWARE.PLEROMA, KNOWN_SOFTWARE.AKKOMA].includes(
		domain as any,
	)
		? 'Known Network'
		: 'Public Timeline';
	return (
		<View>
			<Text style={styles.timelineTypeText}>{mainText}</Text>
			<Text style={styles.timelineTargetText}>{subdomain}</Text>
			<Text style={styles.timelineDescription}>
				This timeline displays every post fetched by your instance
			</Text>
		</View>
	);
});

export default FederatedTimelineController;
