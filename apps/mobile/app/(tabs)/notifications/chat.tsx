import {
	FlatList,
	TextInput,
	View,
	Text,
	KeyboardAvoidingView,
	Pressable,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
	useApiGetChatMessages,
	useApiGetChatroom,
} from '../../../hooks/api/inbox/useApiGetChats';
import { useEffect, useReducer, useState } from 'react';
import {
	chatroomReducer,
	ChatroomReducerActionType,
	chatroomReducerDefault,
} from '../../../states/interactors/chatroom.reducer';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '../../../components/shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import { AppMessageObject } from '../../../types/app-message.types';
import { AppText } from '../../../components/lib/Text';
import { AnimatedFlashList } from '@shopify/flash-list';
import { AppUserObject } from '../../../types/app-user.types';
import { Image } from 'expo-image';
import { AppDivider } from '../../../components/lib/Divider';
import {
	useAppAcct,
	useAppApiClient,
	useAppDb,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { AppIcon } from '../../../components/lib/Icon';
import { FontAwesome } from '@expo/vector-icons';
import { APP_FONTS } from '../../../styles/AppFonts';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { AccountMetadataService } from '../../../database/entities/account-metadata';
import { DatetimeUtil } from '../../../utils/datetime.utils';
import { detectFacets } from '../../../utils/atproto-facets.utils';
import { ChatMiddleware } from '../../../services/middlewares/chat.middleware';
import { Loader } from '../../../components/lib/Loader';

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

const MINI_AVATAR_SIZE = 24;

function Message({ message, members, myId }: MessageProps) {
	const { theme } = useAppTheme();
	if (!message?.sender?.id) return <View />;

	const sender = members.find((o) => o.id === message.sender.id);
	if (!sender) return <View />;

	if (message.sender.id === myId) {
		return (
			<View
				style={{
					alignSelf: 'flex-end',
					backgroundColor: theme.primary.a0,
					maxWidth: '60%',
					padding: 6,
					borderRadius: 8,
					marginBottom: 8,
					marginRight: 10,
				}}
			>
				<AppText.Normal style={{ color: 'black' }}>
					{message.content?.raw}
				</AppText.Normal>
			</View>
		);
	}

	return (
		<View style={{ flexDirection: 'row', marginBottom: 8 }}>
			<View>
				{/*@ts-ignore-next-line*/}
				<Image
					source={{
						uri: sender.avatarUrl,
					}}
					style={{
						width: MINI_AVATAR_SIZE,
						height: MINI_AVATAR_SIZE,
						borderRadius: MINI_AVATAR_SIZE / 2,
					}}
				/>
			</View>
			<View
				style={{
					alignSelf: 'flex-end',
					backgroundColor: theme.complementary.a0,
					maxWidth: '60%',
					padding: 6,
					borderRadius: 8,

					marginRight: 10,
					borderTopLeftRadius: 0,
					marginLeft: 4,
				}}
			>
				<AppText.Normal style={{ color: 'black' }}>
					{message.content?.raw}
				</AppText.Normal>
			</View>
			<AppText.Normal
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}
				style={{ marginTop: 'auto' }}
			>
				{DatetimeUtil.timeAgo(message.createdAt)}
			</AppText.Normal>
		</View>
	);
}

function Page() {
	const [State, dispatch] = useReducer(chatroomReducer, chatroomReducerDefault);
	const { theme } = useAppTheme();
	const { acct } = useAppAcct();
	const { driver, client, server } = useAppApiClient();
	const { db } = useAppDb();
	const [MessageText, setMessageText] = useState(null);
	// reset the timeline on param change
	const params = useLocalSearchParams();
	const roomId: string = params['roomId'] as string;

	const { data: RoomData } = useApiGetChatroom(roomId);
	const { data: nextMessages } = useApiGetChatMessages(roomId, undefined);

	const myId = AccountMetadataService.getAccountDid(db, acct);

	// reset on room change!
	useEffect(() => {
		dispatch({
			type: ChatroomReducerActionType.RESET,
		});
		return;
	}, [roomId]);

	useEffect(() => {
		if (!RoomData || !nextMessages) {
			dispatch({
				type: ChatroomReducerActionType.RESET,
			});
			return;
		}
		dispatch({
			type: ChatroomReducerActionType.INIT_ROOM,
			payload: {
				room: RoomData,
			},
		});
		dispatch({
			type: ChatroomReducerActionType.INIT_MESSAGES,
			payload: {
				messages: nextMessages.items,
				minId: nextMessages.cursor,
			},
		});
	}, [RoomData, nextMessages]);

	const [height, setHeight] = useState(40); // Initial height
	const [IsMessageLoading, setIsMessageLoading] = useState(false);
	const MAX_HEIGHT = 160;
	const { translateY, onScroll } = useScrollMoreOnPageEnd({
		itemCount: 0,
		updateQueryCache: () => {},
	});

	/**
	 * Send the message
	 */
	async function onSendMessage() {
		setIsMessageLoading(true);
		client.notifications
			.sendMessage(roomId, {
				text: MessageText,
				facets: detectFacets(MessageText),
			})
			.then((res) => {
				dispatch({
					type: ChatroomReducerActionType.APPEND_MESSAGE,
					payload: {
						message: ChatMiddleware.deserialize<unknown>(
							res.data,
							driver,
							server,
						),
					},
				});
				setMessageText(null);
			})
			.catch((e) => {})
			.finally(() => {
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
				<AnimatedFlashList
					data={State.messages}
					renderItem={({ item }: { item: AppMessageObject }) => (
						<Message message={item} myId={myId} members={State.room?.members} />
					)}
					contentContainerStyle={{
						paddingTop: 54,
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
							<Text
								style={{
									color: theme.secondary.a20,
									fontSize: 28,
									fontFamily: APP_FONTS.BEBAS_NEUE_400,
									marginBottom: 12,
								}}
							>
								Participants
							</Text>
							<View style={{ marginBottom: 16 }}>
								<Participants accounts={State.room?.members || []} />
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
					style={{
						backgroundColor: theme.palette.bg,
						paddingVertical: 8,
						paddingHorizontal: 10,
						flexDirection: 'row',
						width: '100%',
						alignItems: 'center', // height: 'auto',
						height: Math.max(56, height),
					}}
				>
					<View>
						<AppIcon
							id={'chevron-right'}
							emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}
							size={28}
						/>
					</View>
					<View style={{ flexGrow: 1 }}>
						<TextInput
							placeholder={'Message'}
							multiline={true}
							placeholderTextColor={theme.secondary.a40}
							onContentSizeChange={(e) => {
								const _height = e.nativeEvent.contentSize.height;
								setHeight(Math.min(MAX_HEIGHT, _height)); // Update height based on content
							}}
							onChangeText={setMessageText}
							value={MessageText}
							style={{
								textDecorationLine: 'none',
								flex: 1,
								borderRadius: 12,
								backgroundColor: '#242424',
								paddingVertical: 8,
								paddingLeft: 12,
								marginLeft: 6,
								color: theme.secondary.a20,
								fontFamily: APP_FONTS.INTER_400_REGULAR,
								height: 'auto',
								maxHeight: 192,
							}}
						/>
					</View>
					{IsMessageLoading ? (
						<View
							style={{
								marginLeft: 16,
							}}
						>
							<Loader />
						</View>
					) : (
						<Pressable
							style={{
								marginLeft: 12,
								backgroundColor: theme.primary.a0,
								padding: 10,
								borderRadius: '100%',
							}}
							onPress={onSendMessage}
						>
							<FontAwesome
								name="send"
								size={20}
								color={'black'}
								onPress={onSendMessage}
							/>
						</Pressable>
					)}
				</View>
			</AppTopNavbar>
		</KeyboardAvoidingView>
	);
}

export default Page;
