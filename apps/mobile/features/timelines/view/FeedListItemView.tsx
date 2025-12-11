import { useAppTheme } from '#/states/global/hooks';
import { Image, useImage } from 'expo-image';
import { Pressable, View } from 'react-native';
import { appDimensions } from '#/styles/dimensions';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { StatItem } from '#/features/post-view/views/PostInteractionStatsRow';
import TimelineIndicatorPresenter from '../../feeds/presenters/TimelineIndicatorPresenter';
import type { FeedObjectType } from '@dhaaga/bridge';
import { NativeTextMedium, NativeTextSemiBold } from '#/ui/NativeText';
import { AppDividerSoft } from '#/ui/Divider';
import useAppNavigator from '#/states/useAppNavigator';

type SearchResultFeedItemProps = {
	item: FeedObjectType;
};

const FEED_AVATAR_SIZE = 42;

export function FeedListItemView({ item }: SearchResultFeedItemProps) {
	const { theme } = useAppTheme();
	const img = useImage({ uri: item.avatar });
	const { toFeed } = useAppNavigator();

	function onPressFeed() {
		toFeed(item.uri, item.displayName);
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
				<Image
					source={img}
					style={{
						height: FEED_AVATAR_SIZE,
						width: FEED_AVATAR_SIZE,
						borderRadius: 8,
					}}
				/>
				<View style={{ flexGrow: 1, marginLeft: 8 }}>
					<NativeTextSemiBold style={{ fontSize: 16 }}>
						{item.displayName}
					</NativeTextSemiBold>

					<NativeTextMedium
						style={{ fontSize: 14 }}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
					>
						by{' '}
						<NativeTextMedium
							style={{ fontSize: 14 }}
							color={theme.complementary.a0}
						>
							{item.creator.handle}
						</NativeTextMedium>
					</NativeTextMedium>
				</View>
				<TimelineIndicatorPresenter item={item} />
			</View>
			<NativeTextMedium
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
				style={{
					marginBottom: appDimensions.timelines.sectionBottomMargin * 2,
				}}
			>
				{item.description}
			</NativeTextMedium>
			<View style={{}}>
				<StatItem
					count={item.likeCount}
					onPress={() => {}}
					label={'Likes'}
					nextCounts={[]}
				/>
			</View>
			<AppDividerSoft />
		</Pressable>
	);
}

export default FeedListItemView;
