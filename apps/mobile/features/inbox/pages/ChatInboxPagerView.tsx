import { useState } from 'react';
import { useApiGetChatUpdates } from '#/hooks/api/useNotifications';
import { FlatList, RefreshControl, View } from 'react-native';
import { useAppApiClient } from '#/states/global/hooks';
import { DriverService, KNOWN_SOFTWARE } from '@dhaaga/bridge';
import NavBar_Inbox from '#/features/navbar/views/NavBar_Inbox';
import FeatureNotAvailable from '../components/FeatureNotAvailable';
import ChatRoomListItemView from '#/features/timelines/view/ChatRoomListItemView';
import { AppDividerSoft } from '#/ui/Divider';
import { appDimensions } from '#/styles/dimensions';
import useScrollHandleFlatList from '#/hooks/anim/useScrollHandleFlatList';

function ChatInboxPagerView() {
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

	const { scrollHandler, animatedStyle } = useScrollHandleFlatList();

	if (!DriverService.supportsAtProto(driver))
		return (
			<>
				<NavBar_Inbox
					label={'Chat'}
					type={'chats'}
					animatedStyle={animatedStyle}
				/>
				<FeatureNotAvailable />
			</>
		);

	return (
		<>
			<NavBar_Inbox
				label={'Chat'}
				type={'chats'}
				animatedStyle={animatedStyle}
			/>
			<FlatList
				onScroll={scrollHandler}
				data={data?.data ?? []}
				renderItem={({ item }) => <ChatRoomListItemView room={item} />}
				contentContainerStyle={{
					paddingTop: appDimensions.topNavbar.hubVariantHeight + 8,
				}}
				progressViewOffset={appDimensions.topNavbar.hubVariantHeight}
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
		</>
	);
}

export default ChatInboxPagerView;
