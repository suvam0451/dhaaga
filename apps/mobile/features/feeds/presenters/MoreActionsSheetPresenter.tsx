import SyncStatusPresenter from './SyncStatusPresenter';
import { Fragment, useEffect, useState } from 'react';
import {
	useAppApiClient,
	useAppBottomSheet,
	useAppTheme,
} from '#/states/global/hooks';
import { View } from 'react-native';
import { appDimensions } from '#/styles/dimensions';
import { Image } from 'expo-image';
import { AppText } from '#/components/lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { StatItem } from '../../post-view/views/PostInteractionStatsRow';
import ProfileFeedAssignInteractor from '../../app-profiles/interactors/ProfileFeedAssignInteractor';
import MenuView from '../../timelines/features/controller/views/MenuView';
import type { FeedObjectType } from '@dhaaga/bridge';
import { AppDividerHard } from '#/ui/Divider';
import { LinkingUtils } from '#/utils/linking.utils';

const FEED_AVATAR_SIZE = 42;

function MoreActionsSheetPresenter() {
	const [Feed, setFeed] = useState<FeedObjectType>(null);
	const { ctx, stateId } = useAppBottomSheet();
	const { theme } = useAppTheme();
	const { client } = useAppApiClient();

	useEffect(() => {
		setFeed(ctx.$type === 'atproto-feed-options' ? ctx.feed : null);
	}, [stateId]);

	if (!Feed) return <View />;

	return (
		<View style={{ flex: 1 }}>
			<ProfileFeedAssignInteractor
				uri={Feed.uri}
				Header={
					<Fragment>
						<View
							style={{
								flexDirection: 'row',
								marginBottom: appDimensions.timelines.sectionBottomMargin * 2,
								backgroundColor: theme.background.a30,
								paddingTop: appDimensions.bottomSheet.clearanceTop,
								borderTopLeftRadius: appDimensions.bottomSheet.borderRadius,
								borderTopRightRadius: appDimensions.bottomSheet.borderRadius,
								paddingBottom: 12,
								paddingHorizontal: 10,
							}}
						>
							<Image
								source={{ uri: Feed.avatar }}
								style={{
									height: FEED_AVATAR_SIZE,
									width: FEED_AVATAR_SIZE,
									borderRadius: 8,
								}}
							/>
							<View style={{ flexGrow: 1, marginLeft: 8 }}>
								<AppText.SemiBold style={{ fontSize: 16 }}>
									{Feed.displayName}
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
										{Feed.creator.handle}
									</AppText.Medium>
								</AppText.Medium>
							</View>
						</View>
						<View style={{ paddingHorizontal: 10 }}>
							<AppText.Normal
								emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
								style={{
									marginBottom: appDimensions.timelines.sectionBottomMargin * 2,
								}}
							>
								{Feed.description}
							</AppText.Normal>
							<View style={{}}>
								<StatItem
									count={Feed.likeCount}
									onPress={() => {}}
									label={'Likes'}
									nextCounts={[]}
								/>
							</View>
							<SyncStatusPresenter uri={Feed.uri} />
							<AppDividerHard />
						</View>
					</Fragment>
				}
				Footer={
					<View style={{ marginBottom: 32 }}>
						<MenuView
							onOpenInBrowser={() => {
								LinkingUtils.openAtProtoFeed(client, Feed.uri);
							}}
						/>
					</View>
				}
			/>
		</View>
	);
}

export default MoreActionsSheetPresenter;
