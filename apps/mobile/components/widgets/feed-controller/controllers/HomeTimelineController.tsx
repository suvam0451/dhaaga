import { memo } from 'react';
import { View, Text } from 'react-native';
import { styles } from './_shared';
import { useAppTheme } from '../../../../hooks/app/useAppThemePack';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const HomeTimelineController = memo(function Foo() {
	const { acct } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
		})),
	);
	const { colorScheme } = useAppTheme();
	return (
		<View>
			<Text
				style={[
					styles.timelineTypeText,
					{
						color: colorScheme.textColor.high,
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
						color: colorScheme.textColor.medium,
					},
				]}
			>
				This is your server's home timeline.
			</Text>

			<Text
				style={[
					styles.timelineDescription,
					{
						color: colorScheme.textColor.medium,
					},
				]}
			>
				It usually displays posts from you and everyone you follow.
			</Text>
		</View>
	);
});

export default HomeTimelineController;
