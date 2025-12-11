import { Pressable, View } from 'react-native';
import { Loader } from '#/components/lib/Loader';
import { FontAwesome } from '@expo/vector-icons';
import { useAppTheme } from '#/states/global/hooks';

type Props = {
	onSend: () => void;
	isSending: boolean;
	isEnabled: boolean;
};

function SendButtonView({ isSending, onSend, isEnabled }: Props) {
	const { theme } = useAppTheme();

	if (isSending)
		return (
			<View
				style={{
					marginLeft: 16,
				}}
			>
				<Loader />
			</View>
		);

	return (
		<Pressable
			style={{
				marginLeft: 12,
				backgroundColor: isEnabled ? theme.primary.a0 : theme.secondary.a50,
				padding: 10,
				borderRadius: 32,
			}}
			onPress={onSend}
		>
			<FontAwesome name="send" size={20} color={'black'} onPress={onSend} />
		</Pressable>
	);
}

export default SendButtonView;
