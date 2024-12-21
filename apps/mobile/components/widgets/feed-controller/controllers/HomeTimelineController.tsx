import { memo } from 'react';
import { Text } from 'react-native';
import { styles } from './_shared';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const HomeTimelineController = memo(function Foo() {
	const desc: string[] = [
		"This is your server's home timeline.",
		'It displays posts from you and everyone you follow.',
	];

	const { acct, theme } = useGlobalState(
		useShallow((o) => ({
			acct: o.acct,
			theme: o.colorScheme,
		})),
	);

	return (
		<>
			<Text
				style={[
					styles.timelineTypeText,
					{
						color: theme.primary.a10,
					},
				]}
			>
				Home Timeline
			</Text>
			<Text
				style={[
					styles.timelineTargetText,
					{
						color: theme.complementary.a0,
					},
				]}
			>
				{acct?.server}
			</Text>
			{desc.map((item, i) => (
				<Text
					key={i}
					style={[
						styles.timelineDescription,
						{
							color: theme.secondary.a20,
						},
					]}
				>
					{item}
				</Text>
			))}
		</>
	);
});

export default HomeTimelineController;
