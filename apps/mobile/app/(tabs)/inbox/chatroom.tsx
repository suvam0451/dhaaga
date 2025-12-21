import { FlatList, View, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { Image } from 'expo-image';
import { AppDivider } from '#/components/lib/Divider';
import { useAppTheme } from '#/states/global/hooks';
import { AppIcon } from '#/components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import useChatroom from '#/features/chats/interactors/useChatroom';
import SendButtonView from '#/features/chats/views/SendButtonView';
import InputView from '#/features/chats/views/InputView';
import { appDimensions } from '#/styles/dimensions';
import RecievedMessageView from '#/features/chats/views/RecievedMessageView';
import type { UserObjectType, MessageObjectType } from '@dhaaga/bridge';
import NavBar_Simple from '#/features/navbar/views/NavBar_Simple';
import {
	useApiGetChatMessages,
	useApiGetChatroom,
} from '#/features/chats/api/useApiGetChats';
import { useLocalSearchParams } from 'expo-router';
import {
	ChatroomCtx,
	ChatroomStateAction,
	useChatroomDispatch,
	useChatroomState,
} from '@dhaaga/react';
import Animated from 'react-native-reanimated';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import TimelineStateIndicator from '#/features/timelines/components/TimelineStateIndicator';

type ParticipantsProps = {
	accounts: UserObjectType[];
};

function Participants({ accounts }: ParticipantsProps) {
	const AVATAR_SIZE = 48;
	return (
		<FlatList
			horizontal={true}
			data={accounts}
			renderItem={({ item }: { item: UserObjectType }) => (
				<View style={{ padding: 4 }}>
					<Image
						source={{ uri: item.avatarUrl }}
						style={{
							width: AVATAR_SIZE,
							height: AVATAR_SIZE,
							borderRadius: AVATAR_SIZE / 2,
						}}
					/>
				</View>
			)}
		/>
	);
}

type MessageProps = {
	message: MessageObjectType;
};

function Message({ message }: MessageProps) {
	return <RecievedMessageView avatarUrl={null} item={message} />;
}

function Generator() {
	const { theme } = useAppTheme();
	const [MessageText, setMessageText] = useState(null);

	const params = useLocalSearchParams();
	const roomId: string = params['roomId'] as string;

	const [height, setHeight] = useState(40); // Initial height
	const [IsMessageLoading, setIsMessageLoading] = useState(false);

	const { data: RoomData } = useApiGetChatroom(roomId);
	const queryResult = useApiGetChatMessages(roomId, undefined);
	const { data: nextMessages, fetchStatus, error } = queryResult;

	const State = useChatroomState();
	const dispatch = useChatroomDispatch();

	useEffect(() => {
		dispatch({
			type: ChatroomStateAction.RESET,
		});
	}, []);

	useEffect(() => {
		if (fetchStatus === 'fetching' || !!error) return;
		dispatch({
			type: ChatroomStateAction.APPEND_PAGE,
			payload: nextMessages,
		});
	}, [fetchStatus, error]);

	const { state, sendMessage } = useChatroom();
	/**
	 * Send the message
	 */
	async function onSendMessage() {
		setIsMessageLoading(true);
		sendMessage(MessageText)
			.catch((e) => {
				setIsMessageLoading(false);
			})
			.finally(() => {
				setMessageText(null);
				setIsMessageLoading(false);
			});
	}

	const [ContainerHeight, setContainerHeight] = useState(0);
	function onLayout(event: any) {
		setContainerHeight(event.nativeEvent.layout.height);
	}

	return (
		<View style={{ flex: 1 }}>
			<NavBar_Simple label={'Chat'} />
			<Animated.View style={[{ flex: 1 }]}>
				<FlatList
					onLayout={onLayout}
					data={State.items}
					renderItem={({ item }) => <Message message={item} />}
					contentContainerStyle={{
						paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 4,
					}}
					style={{ flex: 1, backgroundColor: theme.background.a0 }}
					ListHeaderComponent={
						<View
							style={{
								flexGrow: 1,
								flex: 1,
								marginBottom: 16,
								marginLeft: 8,
							}}
						></View>
					}
					ListEmptyComponent={
						<TimelineStateIndicator
							queryResult={queryResult}
							numItems={State.items.length}
							itemType={'message'}
							containerHeight={ContainerHeight}
						/>
					}
					renderScrollComponent={(props) => (
						<KeyboardAwareScrollView {...props} />
					)}
				/>

				<AppDivider.Hard style={{ backgroundColor: '#363636', height: 0.5 }} />

				<View
					style={[
						styles.sendInterface,
						{
							backgroundColor: theme.background.a0,
						},
					]}
				>
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
						text={MessageText}
						setText={setMessageText}
					/>
					<SendButtonView
						isEnabled={true}
						onSend={onSendMessage}
						isSending={IsMessageLoading}
					/>
				</View>
			</Animated.View>
		</View>
	);
}

function Page() {
	return (
		<View style={{ flex: 1 }}>
			<ChatroomCtx>
				<Generator />
			</ChatroomCtx>
		</View>
	);
}

export default Page;

const styles = StyleSheet.create({
	sendInterface: {
		paddingVertical: 8,
		paddingHorizontal: 10,
		flexDirection: 'row',
		alignItems: 'center',
		bottom: 0,
	},
});
