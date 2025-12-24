import { RefreshControl } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useAppTheme } from '#/states/global/hooks';
import { appDimensions } from '#/styles/dimensions';
import ChatRoomMessageItemView from '#/features/chat/views/ChatRoomMessageItemView';
import type { MessageObjectType } from '@dhaaga/bridge';
import NavBar_Simple from '#/features/navbar/views/NavBar_Simple';
import {
	useApiGetChatMessages,
	useApiGetChatroom,
} from '#/features/chat/hooks/useApiGetChats';
import { useLocalSearchParams } from 'expo-router';
import {
	ChatroomCtx,
	ChatroomStateAction,
	useChatroomDispatch,
	useChatroomState,
} from '@dhaaga/react';
import TimelineStateIndicator from '#/features/timelines/components/TimelineStateIndicator';
import ReplyComposerView from '#/features/chat/views/ReplyComposerView';
import useScrollHandleFlatList from '#/hooks/anim/useScrollHandleFlatList';
import { LegendList, LegendListRef } from '@legendapp/list';

type MessageProps = {
	message: MessageObjectType;
};

function Message({ message }: MessageProps) {
	return <ChatRoomMessageItemView item={message} />;
}

function Generator() {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { theme } = useAppTheme();
	const params = useLocalSearchParams();
	const roomId: string = params['roomId'] as string;

	const {
		data: RoomData,
		fetchStatus: chatRoomFetchStatus,
		error: chatRoomFetchError,
	} = useApiGetChatroom(roomId);
	const queryResult = useApiGetChatMessages(roomId, undefined);
	const { data: nextMessages, fetchStatus, error, refetch } = queryResult;

	function onRefresh() {
		setIsRefreshing(true);
		refetch().finally(() => setIsRefreshing(false));
	}

	const State = useChatroomState();
	const dispatch = useChatroomDispatch();

	useEffect(() => {
		dispatch({
			type: ChatroomStateAction.RESET,
		});
	}, []);

	useEffect(() => {
		if (chatRoomFetchStatus === 'fetching' || !!chatRoomFetchError) return;
		dispatch({
			type: ChatroomStateAction.SET_ROOM_DATA,
			payload: {
				roomData: RoomData,
			},
		});
	}, [chatRoomFetchStatus, chatRoomFetchError]);

	useEffect(() => {
		if (fetchStatus === 'fetching' || !!error) return;
		dispatch({
			type: ChatroomStateAction.APPEND_PAGE,
			payload: nextMessages,
		});
	}, [fetchStatus, error]);

	const [ContainerHeight, setContainerHeight] = useState(0);
	function onLayout(event: any) {
		setContainerHeight(event.nativeEvent.layout.height);
	}

	const { scrollHandler, animatedStyle } = useScrollHandleFlatList();

	const listRef = useRef<LegendListRef>(null);

	return (
		<>
			<NavBar_Simple label={'Chat'} animatedStyle={animatedStyle} />
			<LegendList
				ref={listRef}
				onScroll={scrollHandler}
				onLayout={onLayout}
				data={State.items}
				renderItem={({ item }) => <Message message={item} />}
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.scrollViewTopPadding + 16,
					paddingBottom: appDimensions.bottomNav.secondMenuBarHeight + 4,
				}}
				refreshControl={
					<RefreshControl refreshing={IsRefreshing} onRefresh={onRefresh} />
				}
				style={{ flex: 1, backgroundColor: theme.background.a0 }}
				ListEmptyComponent={
					<TimelineStateIndicator
						queryResult={queryResult}
						numItems={State.items.length}
						itemType={'message'}
						containerHeight={ContainerHeight}
					/>
				}
			/>
			<ReplyComposerView roomId={roomId} listRef={listRef} />
		</>
	);
}

function Page() {
	return (
		<ChatroomCtx>
			<Generator />
		</ChatroomCtx>
	);
}

export default Page;
