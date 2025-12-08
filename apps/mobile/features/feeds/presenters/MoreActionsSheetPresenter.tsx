import SyncStatusPresenter from './SyncStatusPresenter';
import { Fragment, useEffect, useState } from 'react';
import {
	useAppApiClient,
	useAppBottomSheet,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';
import { View } from 'react-native';
import { appDimensions } from '#/styles/dimensions';
import { Image } from 'expo-image';
import { AppText } from '#/components/lib/Text';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';
import { StatItem } from '../../post-view/views/PostInteractionStatsRow';
import ProfileFeedAssignInteractor from '../../app-profiles/interactors/ProfileFeedAssignInteractor';
import MenuView from '../../timelines/features/controller/views/MenuView';
import { LinkingUtils } from '#/utils/linking.utils';
import { AppDivider } from '#/components/lib/Divider';
import { AtprotoApiAdapter, AtprotoUtils } from '@dhaaga/bridge';
import type { FeedObjectType } from '@dhaaga/bridge/typings';

function Divider() {
	const { theme } = useAppTheme();
	return (
		<AppDivider.Hard
			style={{
				marginHorizontal: 10,
				marginVertical: appDimensions.timelines.sectionBottomMargin * 2,
				backgroundColor: '#363636',
			}}
		/>
	);
}

const FEED_AVATAR_SIZE = 42;

function MoreActionsSheetPresenter() {
	const { client } = useAppApiClient();
	const [Uri, setUri] = useState<string>(null);
	const [Feed, setFeed] = useState<FeedObjectType>(null);
	const { ctx, stateId } = useAppBottomSheet();
	const { theme } = useAppTheme();

	useEffect(() => {
		if (ctx?.feedUri) setUri(ctx?.feedUri);
		if (ctx?.feed) setFeed(ctx?.feed);
	}, [stateId]);

	if (!Feed) return <View />;

	async function onOpenInBrowser() {
		try {
			const url = await AtprotoUtils.generateFeedUrl(
				client as AtprotoApiAdapter,
				Uri,
			);
			LinkingUtils.openURL(url);
		} catch (e: any) {
			console.log(e);
		}
	}

	return (
		<View style={{ flex: 1 }}>
			<ProfileFeedAssignInteractor
				uri={Uri}
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
							{/*@ts-ignore-next-line*/}
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
							<SyncStatusPresenter uri={Uri} />
							<Divider />
						</View>
					</Fragment>
				}
				Footer={
					<View style={{ marginBottom: 32 }}>
						<MenuView onOpenInBrowser={onOpenInBrowser} />
					</View>
				}
			/>
		</View>
	);
}

export default MoreActionsSheetPresenter;
