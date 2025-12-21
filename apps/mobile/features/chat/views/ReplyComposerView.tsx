import { StyleSheet, View } from 'react-native';
import { AppIcon } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import InputView from '#/features/chat/components/InputView';
import SendButtonView from '#/features/chat/components/SendButtonView';
import { useState } from 'react';
import { useAppTheme } from '#/states/global/hooks';
import useSendMessage from '#/features/chat/hooks/useSendMessage';
import { AppDividerSoft } from '#/ui/Divider';

type Props = {
	roomId: string;
};

function ReplyComposerView({ roomId }: Props) {
	const { theme } = useAppTheme();
	const [height, setHeight] = useState(40); // Initial height
	const [Input, setInput] = useState(null);
	const { send, isLoading } = useSendMessage(roomId);

	async function onSend() {
		if (!Input) return;
		send(Input);
	}

	return (
		<View
			style={[
				styles.sendInterface,
				{
					backgroundColor: theme.background.a0,
				},
			]}
		>
			<AppDividerSoft style={{ height: 0.5 }} />
			<View style={{ height: 'auto' }}>
				<AppIcon
					id={'chevron-right'}
					emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}
					size={28}
				/>
			</View>
			<InputView
				height={height}
				setHeight={setHeight}
				text={Input}
				setText={setInput}
			/>
			<SendButtonView
				isEnabled={!isLoading}
				onSend={onSend}
				isSending={isLoading}
			/>
		</View>
	);
}

export default ReplyComposerView;

const styles = StyleSheet.create({
	sendInterface: {
		position: 'absolute',
		paddingVertical: 8,
		paddingHorizontal: 10,
		flexDirection: 'row',
		alignItems: 'center',
		bottom: 0,
	},
});
