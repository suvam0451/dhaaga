import { useAppBottomSheet, useAppTheme } from '#/states/global/hooks';
import { Image, useImage } from 'expo-image';
import { Pressable, View, StyleSheet } from 'react-native';
import { appDimensions } from '#/styles/dimensions';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { StatItem } from '#/features/post-view/views/PostInteractionStatsRow';
import TimelineIndicatorPresenter from '../../feeds/presenters/TimelineIndicatorPresenter';
import type { FeedObjectType } from '@dhaaga/bridge';
import {
	NativeTextMedium,
	NativeTextNormal,
	NativeTextSemiBold,
} from '#/ui/NativeText';
import { AppDividerSoft } from '#/ui/Divider';
import useAppNavigator from '#/states/useAppNavigator';
import { AppIcon } from '#/components/lib/Icon';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';
import { useFeedEventBusStore } from '#/hooks/pubsub/useFeedEventBus';

type SearchResultFeedItemProps = {
	item: FeedObjectType;
};

const FEED_AVATAR_SIZE = 42;

export function FeedListItemView({ item }: SearchResultFeedItemProps) {
	const { theme } = useAppTheme();
	const img = useImage({ uri: item.avatar });
	const { toFeed } = useAppNavigator();
	const { show } = useAppBottomSheet();

	// registers the item on the event bus
	useFeedEventBusStore(item);

	function onPressFeed() {
		toFeed(item.uri, item.displayName);
	}

	function onPressMoreActions() {
		show(APP_BOTTOM_SHEET_ENUM.MORE_FEED_ACTIONS, true, {
			$type: 'atproto-feed-options',
			feedUri: item.uri,
		});
	}

	if (item.avatar && !img) return <View />;

	return (
		<Pressable
			style={[
				styles.root,
				{
					backgroundColor: theme.background.a20,
				},
			]}
			onPress={onPressFeed}
		>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
				<Image source={img} style={styles.avatar} />
				<View style={styles.labelArea}>
					<NativeTextSemiBold style={{ fontSize: 16 }}>
						{item.displayName}
					</NativeTextSemiBold>

					<NativeTextMedium
						style={{ fontSize: 14 }}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
					>
						by{' '}
						<NativeTextMedium color={theme.complementary}>
							{item.creator.handle}
						</NativeTextMedium>
					</NativeTextMedium>
				</View>
				<TimelineIndicatorPresenter item={item} />
			</View>
			<AppDividerSoft style={{ marginVertical: 8 }} />
			<NativeTextNormal
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
				style={{
					marginBottom: appDimensions.timelines.sectionBottomMargin,
				}}
			>
				{item.description}
			</NativeTextNormal>
			<AppDividerSoft style={{ marginVertical: 8 }} />
			<View style={{ flexDirection: 'row' }}>
				<StatItem
					count={item.likeCount}
					onPress={() => {}}
					label={'Likes'}
					nextCounts={[]}
					style={{ flex: 1 }}
				/>
				<Pressable style={{ paddingRight: 8 }} onPress={onPressMoreActions}>
					<AppIcon
						id={'ellipsis-v'}
						emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
						size={24}
						color={theme.secondary.a20}
					/>
				</Pressable>
			</View>
		</Pressable>
	);
}

export default FeedListItemView;

const styles = StyleSheet.create({
	root: {
		marginHorizontal: 10,
		borderRadius: 12,
		padding: 10,
		paddingHorizontal: 10,
	},
	avatar: {
		height: FEED_AVATAR_SIZE,
		width: FEED_AVATAR_SIZE,
		borderRadius: 8,
	},
	labelArea: {
		flex: 1,
		marginLeft: 8,
	},
});
