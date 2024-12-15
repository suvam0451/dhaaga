import { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from './_shared';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const BubbleTimelineController = memo(function Foo() {
	const { acct } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
		})),
	);
	return (
		<View>
			<Text style={styles.timelineTypeText}>Bubble Timeline</Text>
			<Text style={styles.timelineTargetText}>{acct?.server}</Text>
			<Text style={styles.timelineDescription}>
				This timeline displays posts from a list of servers curated by your
				instance admin
			</Text>
		</View>
	);
});

export default BubbleTimelineController;
