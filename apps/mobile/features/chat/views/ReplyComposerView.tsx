import { FlatList, StyleSheet, TextInput, View } from 'react-native';
import { AppIcon } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import InputView from '#/features/chat/components/InputView';
import SendButtonView from '#/features/chat/components/SendButtonView';
import { RefObject, useRef, useState } from 'react';
import { useAppTheme } from '#/states/global/hooks';
import useSendMessage from '#/features/chat/hooks/useSendMessage';
import { AppDividerSoft } from '#/ui/Divider';
import { LegendListRef } from '@legendapp/list';

type Props = {
	roomId: string;
	listRef: RefObject<LegendListRef>;
};

function ReplyComposerView({ roomId, listRef }: Props) {
	const { theme } = useAppTheme();
	const [height, setHeight] = useState(40); // Initial height
	const [Input, setInput] = useState(null);

	const inputRef = useRef<TextInput>(null);
	const { send, isLoading } = useSendMessage(roomId, listRef, inputRef);
	async function onSend() {
		if (!Input) return;
		send(Input);
	}

	return (
		<View
			style={[
				styles.sendInterface,
				{
					backgroundColor: theme.background.a10,
				},
			]}
		>
			<AppDividerSoft style={{ height: 0.5 }} />
			{/*<View style={{ height: 'auto' }}>*/}
			{/*	<AppIcon*/}
			{/*		id={'chevron-right'}*/}
			{/*		emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}*/}
			{/*		size={28}*/}
			{/*	/>*/}
			{/*</View>*/}
			<InputView
				ref={inputRef}
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
		position: 'absolute', // required for auto-resize
		paddingVertical: 8,
		paddingHorizontal: 10,
		flexDirection: 'row',
		alignItems: 'center',
		bottom: 0,
	},
});
