import SyncStatusPresenter from '#/features/feeds/presenters/SyncStatusPresenter';
import {
	useAppApiClient,
	useAppBottomSheet,
	useAppTheme,
} from '#/states/global/hooks';
import { View } from 'react-native';
import { appDimensions } from '#/styles/dimensions';
import { Image } from 'expo-image';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { StatItem } from '#/features/post-view/views/PostInteractionStatsRow';
import FeedControlSheetActions from '#/components/dhaaga-bottom-sheet/components/FeedControlSheetActions';
import { AppDividerSoft } from '#/ui/Divider';
import { LinkingUtils } from '#/utils/linking.utils';
import {
	useFeedEventBusActions,
	useFeedEventBusStore,
} from '#/hooks/pubsub/useFeedEventBus';
import BottomSheetMenu from '#/components/dhaaga-bottom-sheet/components/BottomSheetMenu';
import {
	NativeTextMedium,
	NativeTextNormal,
	NativeTextSemiBold,
} from '#/ui/NativeText';
import HubToFeedAllocatorView from '#/features/hub/allocators/HubToFeedAllocatorView';

const FEED_AVATAR_SIZE = 42;

function AtProtoFeedMoreOptions() {
	const { ctx } = useAppBottomSheet();
	const { theme } = useAppTheme();
	const { client } = useAppApiClient();

	const _uri = ctx.$type === 'atproto-feed-options' ? ctx.feedUri : null;
	const { feed } = useFeedEventBusStore(_uri);
	const { toggleSubscription, togglePin } = useFeedEventBusActions(_uri);

	if (!feed) return <View />;

	return (
		<View style={{ flex: 1 }}>
			<BottomSheetMenu
				title={null}
				variant={'raised'}
				CustomHeader={
					<View
						style={{
							flexDirection: 'row',
							marginBottom: appDimensions.timelines.sectionBottomMargin * 2,
							backgroundColor: theme.background.a30,
						}}
					>
						<Image
							source={{ uri: feed.avatar }}
							style={{
								height: FEED_AVATAR_SIZE,
								width: FEED_AVATAR_SIZE,
								borderRadius: 8,
							}}
						/>
						<View style={{ flexGrow: 1, marginLeft: 8 }}>
							<NativeTextSemiBold style={{ fontSize: 16 }}>
								{feed.displayName}
							</NativeTextSemiBold>

							<NativeTextMedium
								style={{ fontSize: 14 }}
								emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
							>
								by{' '}
								<NativeTextMedium
									style={{ fontSize: 14 }}
									color={theme.complementary}
								>
									{feed.creator.handle}
								</NativeTextMedium>
							</NativeTextMedium>
						</View>
					</View>
				}
				style={{ paddingBottom: 0 }}
			/>
			<HubToFeedAllocatorView
				uri={feed.uri}
				Header={
					<>
						<View style={{ paddingHorizontal: 10, paddingTop: 10 }}>
							<NativeTextNormal
								emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
								style={{
									marginBottom: appDimensions.timelines.sectionBottomMargin * 2,
								}}
							>
								{feed.description}
							</NativeTextNormal>
							<View style={{}}>
								<StatItem
									count={feed.likeCount}
									onPress={() => {}}
									label={'Likes'}
									nextCounts={[]}
								/>
							</View>
							<SyncStatusPresenter uri={feed.uri} />
						</View>

						<AppDividerSoft style={{ marginVertical: 16 }} />
						<FeedControlSheetActions
							onOpenInBrowser={() => {
								LinkingUtils.openAtProtoFeed(client, feed.uri);
							}}
							onShare={() => {}}
							onPinToggle={() => {}}
							isPinned={false}
						/>
						<AppDividerSoft style={{ marginVertical: 16 }} />
					</>
				}
			/>
		</View>
	);
}

export default AtProtoFeedMoreOptions;
