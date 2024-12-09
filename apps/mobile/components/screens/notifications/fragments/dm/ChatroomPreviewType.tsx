import { useEffect, useMemo, useState } from 'react';
import { Text } from '@rneui/themed';
import { TouchableOpacity, View } from 'react-native';
import { ActivityPubUser } from '../../../../../entities/activitypub-user.entity';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { ActivityPubStatus } from '../../../../../entities/activitypub-status.entity';
import { useActivityPubRestClientContext } from '../../../../../states/useActivityPubRestClient';
import { ParsedDescriptionContainerForChatroomPreview } from '../../../../../styles/Containers';
import { useNavigation } from '@react-navigation/native';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { useGlobalMmkvContext } from '../../../../../states/useGlobalMMkvCache';

type ChatroomPreviewType = {
	roomId: any;
	modeFilter: 'me' | 'dm' | 'group';
};

function ChatroomPreview({ roomId, modeFilter }: ChatroomPreviewType) {
	const { domain, subdomain } = useActivityPubRestClientContext();
	// const chatroom = useObject(ActivityPubChatRoom, roomId);

	const navigation = useNavigation<any>();

	const [Participants, setParticipants] = useState<ActivityPubUser[]>([]);
	const [IsGroupChat, setIsGroupChat] = useState(false);
	const [IsSoloChat, setIsSoloChat] = useState(false);
	const [IsPairChat, setIsPairChat] = useState(false);
	const [Status, setStatus] = useState<ActivityPubStatus>(null);
	const [LastMessageBefore, setLastMessageBefore] = useState(null);

	// const me = chatroom?.me;
	// const db = useRealm();
	const { globalDb } = useGlobalMmkvContext();

	const ParsedValue = useMemo(() => {
		const target = Status?.content;
		if (!target) return <View></View>;

		return <View></View>;
		// const { reactNodes } = MfmService.renderMfm(target, {
		// 	emojiMap: new Map(),
		// 	domain,
		// 	subdomain,
		// 	db,
		// 	globalDb,
		// });
		// return reactNodes?.map((para, i) => {
		// 	const uuid = randomUUID();
		// 	return (
		// 		<Text key={uuid} style={{ color: '#fff', opacity: 0.87 }}>
		// 			{para.map((o, j) => (
		// 				<Text key={j}>{o}</Text>
		// 			))}
		// 		</Text>
		// 	);
		// });
	}, [Status?.content]);

	// useEffect(() => {
	// 	if (
	// 		chatroom.participants.length === 1 &&
	// 		chatroom.participants[0].userId === chatroom.me.userId
	// 	) {
	// 		setIsSoloChat(true);
	// 	} else if (chatroom.participants.length === 2) {
	// 		setIsPairChat(true);
	// 		setParticipants(
	// 			chatroom.participants.filter((o) => o.userId !== chatroom.me.userId),
	// 		);
	// 	} else {
	// 		setIsGroupChat(true);
	// 		setParticipants(
	// 			chatroom.participants.filter((o) => o.userId !== chatroom.me.userId),
	// 		);
	// 	}
	//
	// 	const statuses = chatroom.conversations.map((o) => o.latestStatus);
	// 	if (statuses.length === 0) return;
	//
	// 	const sorted = statuses.sort((a, b) =>
	// 		a.createdAt > b.createdAt ? 1 : -1,
	// 	);
	// 	setStatus(sorted[0]);
	// 	setLastMessageBefore(sorted[0].createdAt);
	// }, [chatroom]);

	function onClickChatroomItem() {
		// navigation.push('DirectMessagingRoom', { roomId: chatroom._id });
	}

	const activeUserIsSender = false; // Status?.postedBy?.userId === me?.userId;

	return (
		<View
			style={{
				paddingHorizontal: 4,
				backgroundColor: '#141414',
				borderRadius: 8,
				marginBottom: 8,
			}}
		>
			{modeFilter === 'me' && IsSoloChat ? (
				<View>
					<TouchableOpacity onPress={onClickChatroomItem}>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								backgroundColor: '#141414',
								paddingVertical: 4,
								marginVertical: 4,
							}}
						>
							<View style={{ flexGrow: 0 }}>
								<View
									style={{
										width: 48,
										height: 48,
										borderColor: 'gray',
										borderWidth: 2,
										borderRadius: 4,
										position: 'relative',
									}}
								>
									<View style={{ position: 'absolute' }}>
										<FontAwesome5
											name="crown"
											size={24}
											color="white"
											style={{
												backgroundColor: 'transparent',
											}}
										/>
									</View>

									{/*<Image*/}
									{/*	style={{*/}
									{/*		flex: 1,*/}
									{/*		backgroundColor: '#0553',*/}
									{/*		padding: 2,*/}
									{/*	}}*/}
									{/*	source={me?.avatarUrl}*/}
									{/*/>*/}
								</View>
							</View>
							<View style={{ marginLeft: 8 }}>
								<Text
									style={{
										fontSize: 16,
										color: APP_FONT.MONTSERRAT_HEADER,
										fontFamily: 'Montserrat-Bold',
									}}
								>
									{/*{me?.displayName}*/}
								</Text>
								<Text
									style={{
										fontSize: 12,
										color: APP_FONT.MONTSERRAT_BODY,
										fontFamily: 'Montserrat-Bold',
									}}
								>
									{/*@{me?.username}@{me.server.url}*/}
								</Text>
								<View>
									{activeUserIsSender ? (
										<ParsedDescriptionContainerForChatroomPreview>
											{ParsedValue}
										</ParsedDescriptionContainerForChatroomPreview>
									) : (
										<ParsedDescriptionContainerForChatroomPreview>
											<Text style={{ color: 'orange' }}>You: </Text>
											{ParsedValue}
										</ParsedDescriptionContainerForChatroomPreview>
									)}
								</View>
							</View>

							{/*<View style={{marginLeft: 4}}>*/}
							{/*  <WithActivitypubStatusContext status={chatroom.}>*/}
							{/*    <ConversationItem*/}
							{/*        displayName={me.userId}*/}
							{/*        accountUrl={me.userId}*/}
							{/*        unread={false}*/}
							{/*    />*/}
							{/*  </WithActivitypubStatusContext>*/}
							{/*</View>*/}
						</View>
					</TouchableOpacity>
				</View>
			) : (
				<View></View>
			)}

			{modeFilter === 'dm' && IsPairChat ? (
				<View>
					<TouchableOpacity onPress={onClickChatroomItem}>
						<View
							style={{
								display: 'flex',
								flexDirection: 'row',
								paddingVertical: 4,
								marginVertical: 4,
							}}
						>
							<View style={{ display: 'flex', flexDirection: 'row' }}>
								<View
									style={{
										width: 48,
										height: 48,
										borderColor: 'gray',
										borderWidth: 2,
										borderRadius: 4,
									}}
								>
									{/*<Image*/}
									{/*	style={{*/}
									{/*		flex: 1,*/}
									{/*		backgroundColor: '#0553',*/}
									{/*		padding: 2,*/}
									{/*	}}*/}
									{/*	source={Participants[0]?.avatarUrl}*/}
									{/*/>*/}
								</View>
							</View>
							<View style={{ marginLeft: 8, flex: 1 }}>
								<Text
									style={{
										fontSize: 16,
										color: APP_FONT.MONTSERRAT_HEADER,
										fontFamily: 'Montserrat-Bold',
									}}
								>
									{Participants[0]?.displayName}
								</Text>
								<Text
									style={{
										fontSize: 12,
										color: APP_FONT.MONTSERRAT_BODY,
										fontFamily: 'Montserrat-Bold',
									}}
								>
									@{Participants[0]?.username}@{Participants[0]?.server?.url}
								</Text>
								<View style={{ maxWidth: '100%' }}>
									{activeUserIsSender ? (
										<Text style={{ marginTop: 4 }} numberOfLines={2}>
											<Text style={{ color: APP_FONT.MONTSERRAT_BODY }}>
												You:{' '}
											</Text>
											{ParsedValue}
										</Text>
									) : (
										<Text style={{ marginTop: 4 }} numberOfLines={2}>
											<Text style={{ color: APP_FONT.MONTSERRAT_BODY }}>
												You:{' '}
											</Text>
											{ParsedValue}
										</Text>
									)}
								</View>
							</View>

							{/*<View style={{marginLeft: 4}}>*/}
							{/*  <WithActivitypubStatusContext status={chatroom.}>*/}
							{/*    <ConversationItem*/}
							{/*        displayName={me.userId}*/}
							{/*        accountUrl={me.userId}*/}
							{/*        unread={false}*/}
							{/*    />*/}
							{/*  </WithActivitypubStatusContext>*/}
							{/*</View>*/}
						</View>
					</TouchableOpacity>
				</View>
			) : (
				<View></View>
			)}
		</View>
	);
}

export default ChatroomPreview;
