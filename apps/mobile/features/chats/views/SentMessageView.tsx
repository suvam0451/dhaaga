import { View, StyleSheet } from 'react-native';
import { AppText } from '../../../components/lib/Text';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { AppMessageObject } from '../../../types/app-message.types';

type Props = {
	item: AppMessageObject;
};

function SentMessageView({ item }: Props) {
	const { theme } = useAppTheme();

	return (
		<View
			style={[
				styles.msgContainer,
				{
					backgroundColor: theme.primary.a0,
				},
			]}
		>
			<AppText.Normal style={{ color: 'black' }}>
				{item.content?.raw}
			</AppText.Normal>
		</View>
	);
}

export default SentMessageView;

const styles = StyleSheet.create({
	msgContainer: {
		alignSelf: 'flex-end',
		maxWidth: '60%',
		padding: 6,
		borderRadius: 8,
		marginBottom: 8,
		marginRight: 10,
	},
});
