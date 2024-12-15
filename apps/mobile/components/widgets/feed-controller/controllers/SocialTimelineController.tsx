import { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from './_shared';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const SocialTimelineController = memo(function Foo() {
	const { acct } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
		})),
	);
	return (
		<View>
			<Text style={styles.timelineTypeText}>Your Social Timeline</Text>
			<Text style={styles.timelineTargetText}>{acct?.server}</Text>
			<Text style={styles.timelineDescription}>
				This timeline has posts from your friends and other users from your
				server.
			</Text>
		</View>
	);
});

export default SocialTimelineController;
