import { useAppTheme } from '../../../hooks/utility/global-state-extractors';
import { Image, useImage } from 'expo-image';
import { Pressable, View } from 'react-native';
import { AppText } from '../../../components/lib/Text';
import { AppDivider } from '../../../components/lib/Divider';
import { appDimensions } from '../../../styles/dimensions';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../utils/theming.util';
import { StatItem } from '../../../components/common/status/PostStats';
import { router } from 'expo-router';
import { APP_ROUTING_ENUM } from '../../../utils/route-list';
import TimelineIndicatorPresenter from '../../feeds/presenters/TimelineIndicatorPresenter';
import type { FeedObjectType } from '@dhaaga/bridge';

type SearchResultFeedItemProps = {
	item: FeedObjectType;
};

const FEED_AVATAR_SIZE = 42;

export function FeedListItemView({ item }: SearchResultFeedItemProps) {
	const { theme } = useAppTheme();
	const img = useImage({ uri: item.avatar });

	function onPressFeed() {
		router.navigate({
			pathname: APP_ROUTING_ENUM.DISCOVER_FEED,
			params: {
				uri: item.uri,
				displayName: item.displayName,
			},
		});
	}

	if (item.avatar && !img) return <View />;

	return (
		<Pressable style={{ paddingHorizontal: 10 }} onPress={onPressFeed}>
			<View
				style={{
					flexDirection: 'row',
					marginBottom: appDimensions.timelines.sectionBottomMargin * 2,
				}}
			>
				{/*@ts-ignore-next-line*/}
				<Image
					source={img}
					style={{
						height: FEED_AVATAR_SIZE,
						width: FEED_AVATAR_SIZE,
						borderRadius: 8,
					}}
				/>
				<View style={{ flexGrow: 1, marginLeft: 8 }}>
					<AppText.SemiBold style={{ fontSize: 16 }}>
						{item.displayName}
					</AppText.SemiBold>

					<AppText.Medium
						style={{ fontSize: 14 }}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
					>
						by{' '}
						<AppText.Medium
							style={{ fontSize: 14 }}
							color={theme.complementary.a0}
						>
							{item.creator.handle}
						</AppText.Medium>
					</AppText.Medium>
				</View>
				<TimelineIndicatorPresenter item={item} />
			</View>
			<AppText.Normal
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
				style={{
					marginBottom: appDimensions.timelines.sectionBottomMargin * 2,
				}}
			>
				{item.description}
			</AppText.Normal>
			<View style={{}}>
				<StatItem
					count={item.likeCount}
					onPress={() => {}}
					label={'Likes'}
					nextCounts={[]}
				/>
			</View>
			<AppDivider.Soft
				style={{
					backgroundColor: '#363636',
					marginVertical: 12,
				}}
			/>
		</Pressable>
	);
}

export default FeedListItemView;
