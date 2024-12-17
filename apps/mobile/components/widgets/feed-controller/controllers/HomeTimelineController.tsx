import { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from './_shared';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const HomeTimelineController = memo(function Foo() {
	const { acct, theme } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			theme: o.colorScheme,
		})),
	);
	return (
		<View>
			<Text
				style={[
					styles.timelineTypeText,
					{
						color: theme.textColor.high,
					},
				]}
			>
				Home Timeline
			</Text>
			<Text style={styles.timelineTargetText}>{acct?.server}</Text>
			<Text
				style={[
					styles.timelineDescription,
					{
						color: theme.textColor.medium,
					},
				]}
			>
				This is your server's home timeline.
			</Text>

			<Text
				style={[
					styles.timelineDescription,
					{
						color: theme.textColor.medium,
					},
				]}
			>
				It usually displays posts from you and everyone you follow.
			</Text>
		</View>
	);
});

export default HomeTimelineController;
