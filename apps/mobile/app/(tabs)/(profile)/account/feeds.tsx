import { Pressable, RefreshControl, View } from 'react-native';
import useApiGetMyFeeds from '#/hooks/api/useFeeds';
import { AppText } from '#/components/lib/Text';
import { appDimensions } from '#/styles/dimensions';
import type { FeedObjectType } from '@dhaaga/bridge';
import { AppIcon } from '#/components/lib/Icon';
import { AppDivider } from '#/components/lib/Divider';
import { Image } from 'expo-image';
import { useAppTheme } from '#/states/global/hooks';
import { router } from 'expo-router';
import NavBar_Simple from '#/features/navbar/views/NavBar_Simple';
import Animated from 'react-native-reanimated';
import { useState } from 'react';
import useScrollHandleAnimatedList from '#/hooks/anim/useScrollHandleAnimatedList';
import { NativeTextSpecial } from '#/ui/NativeText';

type MyFeedItemProps = {
	item: FeedObjectType;
};

function MyFeedItem({ item }: MyFeedItemProps) {
	function onPress() {
		router.navigate({
			pathname: '/profile/feed',
			params: {
				uri: item?.uri,
				displayName: item?.displayName,
			},
		});
	}

	return (
		<Pressable style={{ paddingHorizontal: 10 }} onPress={onPress}>
			<View
				style={{
					flexDirection: 'row',
					width: '100%',
					paddingVertical: 4,
					alignItems: 'center',
				}}
			>
				<View>
					<Image
						source={{ uri: item?.avatar }}
						style={{ width: 36, height: 36, borderRadius: 8 }}
					/>
				</View>
				<View style={{ flexGrow: 1, marginLeft: 8 }}>
					<AppText.Medium style={{ fontSize: 18 }}>
						{item.displayName}
					</AppText.Medium>
				</View>

				<View style={{ width: 24 }}>
					<AppIcon id={'chevron-right'} />
				</View>
			</View>
		</Pressable>
	);
}

function Page() {
	const [IsRefreshing, setIsRefreshing] = useState(false);
	const { theme } = useAppTheme();
	const { data, refetch } = useApiGetMyFeeds();
	const { scrollHandler, animatedStyle } = useScrollHandleAnimatedList();

	function onRefresh() {
		setIsRefreshing(true);
		refetch().finally(() => setIsRefreshing(false));
	}

	return (
		<>
			<NavBar_Simple label={'My Feeds'} animatedStyle={animatedStyle} />
			<Animated.FlatList
				data={data ?? []}
				renderItem={({ item }) => <MyFeedItem item={item} />}
				onScroll={scrollHandler}
				ListHeaderComponent={
					<NativeTextSpecial
						style={{
							fontSize: 32,
							marginHorizontal: 10,
							marginVertical: appDimensions.timelines.sectionBottomMargin * 3,
						}}
					>
						My Feeds
					</NativeTextSpecial>
				}
				contentContainerStyle={{
					marginTop: appDimensions.topNavbar.scrollViewTopPadding,
				}}
				style={{ backgroundColor: theme.background.a0 }}
				ListEmptyComponent={
					<AppText.SemiBold
						style={{ textAlign: 'center', fontSize: 24, paddingVertical: 24 }}
					>
						Some Error Occurred
					</AppText.SemiBold>
				}
				refreshControl={
					<RefreshControl refreshing={IsRefreshing} onRefresh={onRefresh} />
				}
				ItemSeparatorComponent={() => (
					<AppDivider.Hard
						style={{ marginVertical: 8, backgroundColor: theme.background.a50 }}
					/>
				)}
			/>
		</>
	);
}

export default Page;
