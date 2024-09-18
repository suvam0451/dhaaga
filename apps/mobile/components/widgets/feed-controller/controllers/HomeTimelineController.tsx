import { memo } from 'react';
import { View, Text } from 'react-native';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { styles } from './_shared';
import { useAppTheme } from '../../../../hooks/app/useAppThemePack';

const HomeTimelineController = memo(function Foo() {
	const { subdomain } = useActivityPubRestClientContext();
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
				Your Home Timeline
			</Text>
			<Text style={styles.timelineTargetText}>{subdomain}</Text>
			<Text
				style={[
					styles.timelineDescription,
					{
						color: colorScheme.textColor.medium,
					},
				]}
			>
				This timeline displays post from you and your friends
			</Text>
		</View>
	);
});

export default HomeTimelineController;
