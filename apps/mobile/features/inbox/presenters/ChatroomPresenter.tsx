import { useState } from 'react';
import { useApiGetChatUpdates } from '#/hooks/api/useNotifications';
import { RefreshControl, View } from 'react-native';
import { useAppApiClient } from '#/states/global/hooks';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import Header from '../components/Header';
import FeatureNotAvailable from '../components/FeatureNotAvailable';
import { FlashList } from '@shopify/flash-list';
import ChatRoomListItemView from '#/features/timelines/view/ChatRoomListItemView';
import { AppDividerSoft } from '#/ui/Divider';

function ChatroomPresenter() {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { driver } = useAppApiClient();
	const queryResult = useApiGetChatUpdates();
	const { refetch, data } = queryResult;

	function refresh() {
		setIsRefreshing(true);
		refetch().finally(() => {
			setIsRefreshing(false);
		});
	}

	return (
		<FlashList
			data={data?.data ?? []}
			renderItem={({ item }) => <ChatRoomListItemView room={item} />}
			ListHeaderComponent={<Header label={'Chat'} type={'chats'} />}
			refreshControl={
				<RefreshControl refreshing={IsRefreshing} onRefresh={refresh} />
			}
			ItemSeparatorComponent={() => (
				<AppDividerSoft style={{ marginVertical: 10 }} />
			)}
			ListEmptyComponent={
				driver !== KNOWN_SOFTWARE.BLUESKY ? <FeatureNotAvailable /> : <View />
			}
		/>
	);
}

export default ChatroomPresenter;
