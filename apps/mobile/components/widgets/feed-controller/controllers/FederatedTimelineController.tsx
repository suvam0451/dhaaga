import { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from './_shared';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const FederatedTimelineController = memo(function Foo() {
	const { driver, acct } = useGlobalState(
		useShallow((o) => ({
			driver: o.driver,
			acct: o.acct,
		})),
	);
	const mainText = [KNOWN_SOFTWARE.PLEROMA, KNOWN_SOFTWARE.AKKOMA].includes(
		driver,
	)
		? 'Known Network'
		: 'Public Timeline';
	return (
		<View>
			<Text style={styles.timelineTypeText}>{mainText}</Text>
			<Text style={styles.timelineTargetText}>{acct?.server}</Text>
			<Text style={styles.timelineDescription}>
				This timeline displays every post fetched by your instance
			</Text>
		</View>
	);
});

export default FederatedTimelineController;
