import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useAppTheme } from '#/states/global/hooks';

type Props = {
	onSend: () => Promise<void>;
	isSending: boolean;
	isEnabled: boolean;
};

function SendButtonView({ isSending, onSend, isEnabled }: Props) {
	const { theme } = useAppTheme();
	return (
		<Pressable
			style={[
				styles.root,
				{
					backgroundColor: isEnabled ? theme.primary : theme.secondary.a50,
				},
			]}
			onPress={onSend}
		>
			{isSending ? (
				<ActivityIndicator color={theme.primaryText} />
			) : (
				<FontAwesome
					name="send"
					size={20}
					color={theme.primaryText}
					onPress={onSend}
				/>
			)}
		</Pressable>
	);
}

export default SendButtonView;

const styles = StyleSheet.create({
	root: {
		marginLeft: 12,
		padding: 10,
		borderRadius: 32,
	},
});
