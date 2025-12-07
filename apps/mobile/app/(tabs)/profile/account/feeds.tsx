import { FlatList, Pressable, ScrollView, View } from 'react-native';
import useApiGetMyFeeds from '#/hooks/api/useFeeds';
import AppTopNavbar, {
	APP_TOPBAR_TYPE_ENUM,
} from '#/components/shared/topnavbar/AppTopNavbar';
import useScrollMoreOnPageEnd from '#/states/useScrollMoreOnPageEnd';
import { AppText, SpecialText } from '#/components/lib/Text';
import { appDimensions } from '#/styles/dimensions';
import type { FeedObjectType } from '@dhaaga/bridge/typings';
import { AppIcon } from '#/components/lib/Icon';
import { AppDivider } from '#/components/lib/Divider';
import { Image, useImage } from 'expo-image';
import { useAppTheme } from '#/hooks/utility/global-state-extractors';
import { router } from 'expo-router';

type MyFeedItemProps = {
	item: FeedObjectType;
};

function MyFeedItem({ item }: MyFeedItemProps) {
	const { theme } = useAppTheme();
	const image = useImage({ uri: item?.avatar });
	if (!image) return <View />;

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
					{/*@ts-ignore-next-line*/}
					<Image
						source={image}
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
			<AppDivider.Hard
				style={{ marginVertical: 8, backgroundColor: theme.background.a50 }}
			/>
		</Pressable>
	);
}

function Page() {
	const { data, error } = useApiGetMyFeeds();
	const { translateY } = useScrollMoreOnPageEnd();

	if (error) {
		return (
			<AppTopNavbar
				title={'My Feeds'}
				translateY={translateY}
				type={APP_TOPBAR_TYPE_ENUM.GENERIC}
			>
				<ScrollView
					contentContainerStyle={{
						marginTop: appDimensions.topNavbar.scrollViewTopPadding,
					}}
				>
					<AppText.SemiBold
						style={{ textAlign: 'center', fontSize: 24, paddingVertical: 24 }}
					>
						Some Error Occurred
					</AppText.SemiBold>
				</ScrollView>
			</AppTopNavbar>
		);
	}
	return (
		<AppTopNavbar title={'My Feeds'} translateY={translateY}>
			<ScrollView
				contentContainerStyle={{
					marginTop: appDimensions.topNavbar.scrollViewTopPadding,
				}}
			>
				<SpecialText
					style={{
						fontSize: 32,
						marginHorizontal: 10,
						marginVertical: appDimensions.timelines.sectionBottomMargin * 3,
					}}
				>
					My Feeds
				</SpecialText>
				<FlatList
					data={data}
					renderItem={({ item }) => <MyFeedItem item={item} />}
				/>
			</ScrollView>
		</AppTopNavbar>
	);
}

export default Page;
