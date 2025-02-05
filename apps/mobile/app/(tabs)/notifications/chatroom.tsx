import {
	FlatList,
	View,
	KeyboardAvoidingView,
	StyleSheet,
	Animated,
} from 'react-native';
import { useState } from 'react';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../components/shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { AppMessageObject } from '../../../types/app-message.types';
import { AppText } from '../../../components/lib/Text';
import { AppUserObject } from '../../../types/app-user.types';
import { Image } from 'expo-image';
import { AppDivider } from '../../../components/lib/Divider';
import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { AppIcon } from '../../../components/lib/Icon';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import useChatroom from '../../../features/chats/interactors/useChatroom';
import SendButtonView from '../../../features/chats/views/SendButtonView';
import InputView from '../../../features/chats/views/InputView';
import { appDimensions } from '../../../styles/dimensions';
import RecievedMessageView from '../../../features/chats/views/RecievedMessageView';
import SentMessageView from '../../../features/chats/views/SentMessageView';

type ParticipantsProps = {
	accounts: AppUserObject[];
};

function Participants({ accounts }: ParticipantsProps) {
	const AVATAR_SIZE = 48;
	return (
		<FlatList
			horizontal={true}
			data={accounts}
			renderItem={({ item }: { item: AppUserObject }) => (
				<View style={{ padding: 4 }}>
					{/*@ts-ignore-next-line*/}
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
	message: AppMessageObject;
	members: AppUserObject[];
	myId: string;
};

function Message({ message, members, myId }: MessageProps) {
	if (!message?.sender?.id) return <View />;

	const sender = members.find((o) => o.id === message.sender.id);
	if (!sender) return <View />;

	if (message.sender.id === myId) return <SentMessageView item={message} />;

	return <RecievedMessageView avatarUrl={sender.avatarUrl} item={message} />;
}

function Page() {
	const { theme } = useAppTheme();
	const [MessageText, setMessageText] = useState(null);

	const [height, setHeight] = useState(40); // Initial height
	const [IsMessageLoading, setIsMessageLoading] = useState(false);
	const { translateY, onScroll } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	const { state, myId, sendMessage } = useChatroom();
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

	return (
		<KeyboardAvoidingView>
			<AppTopNavbar
				title={`Chat`}
				translateY={translateY}
				type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			>
				<Animated.FlatList
					data={state.messages}
					renderItem={({ item }: { item: AppMessageObject }) => (
						<Message message={item} myId={myId} members={state.room?.members} />
					)}
					contentContainerStyle={{
						paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 4,
					}}
					style={{ marginTop: 'auto' }}
					ListHeaderComponent={
						<View
							style={{
								flexGrow: 1,
								flex: 1,
								marginBottom: 16,
								marginLeft: 8,
							}}
						>
							<AppText.Special
								style={{
									color: theme.secondary.a20,
									fontSize: 28,
									marginBottom: 12,
								}}
							>
								Participants
							</AppText.Special>
							<View style={{ marginBottom: 16 }}>
								<Participants accounts={state.room?.members || []} />
							</View>

							<AppDivider.Hard
								style={{ backgroundColor: '#363636', height: 0.5 }}
							/>
						</View>
					}
					onScroll={onScroll}
				/>

				<AppDivider.Hard style={{ backgroundColor: '#363636', height: 0.5 }} />
				<View
					style={[
						styles.sendInterface,
						{
							height: Math.max(56, height),
						},
					]}
				>
					<View>
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
			</AppTopNavbar>
		</KeyboardAvoidingView>
	);
}

export default Page;

const styles = StyleSheet.create({
	sendInterface: {
		paddingVertical: 8,
		paddingHorizontal: 10,
		flexDirection: 'row',
		alignItems: 'center',
	},
});
