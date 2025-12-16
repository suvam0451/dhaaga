import {
	useActiveUserSession,
	useAppApiClient,
	useAppBottomSheet,
} from '#/states/global/hooks';
import { TimelineFetchMode } from '@dhaaga/core';
import FeedControlView from '#/components/dhaaga-bottom-sheet/components/FeedControlView';
import { View, StyleSheet } from 'react-native';
import FeedControlSheetActions from '#/components/dhaaga-bottom-sheet/components/FeedControlSheetActions';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import {
	AtprotoApiAdapter,
	AtprotoUtils,
	KNOWN_SOFTWARE,
} from '@dhaaga/bridge';
import { LinkingUtils } from '#/utils/linking.utils';
import SyncStatusPresenter from '#/features/feeds/presenters/SyncStatusPresenter';
import { AppDividerHard } from '#/ui/Divider';
import HubToFeedAllocatorView from '#/features/hub/allocators/HubToFeedAllocatorView';

function FeedOptionsBottomSheet() {
	const { ctx } = useAppBottomSheet();
	const { acct } = useActiveUserSession();
	const { driver, client } = useAppApiClient();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SHEETS]);

	if (ctx.$type !== 'set-feed-options') return <View />;

	const query = ctx.query;

	function onOpenInBrowser() {
		if (ctx.$type !== 'set-feed-options') return;
		switch (ctx.feedType) {
			case 'Feed': {
				AtprotoUtils.generateFeedUrl(
					client as AtprotoApiAdapter,
					ctx.query.id,
				).then((o) => {
					LinkingUtils.openURL(o);
				});
				break;
			}
		}
	}

	switch (ctx.feedType) {
		case TimelineFetchMode.FEED:
			return (
				<HubToFeedAllocatorView
					uri={query.id}
					Header={
						<View>
							<FeedControlView
								title={t(`timelines.infoSheet.infoFeed.label`)}
								subtitle={query.label}
								description={
									t(`timelines.infoSheet.infoFeed.description`, {
										returnObjects: true,
									}) as string[]
								}
								context={ctx}
								supportedFilters={[]}
							/>
							<View style={{ marginHorizontal: 12 }}>
								<SyncStatusPresenter uri={query.id} />
							</View>
							<AppDividerHard />
						</View>
					}
					Footer={
						<View style={{ marginBottom: 32 }}>
							<AppDividerHard />
							<FeedControlSheetActions
								onShare={() => {}}
								onPinToggle={() => {}}
								isPinned={false}
								onOpenInBrowser={onOpenInBrowser}
							/>
						</View>
					}
				/>
			);
		case TimelineFetchMode.LOCAL:
			return (
				<FeedControlView
					title={t(`timelines.infoSheet.infoLocal.label`)}
					subtitle={acct?.server}
					description={
						t(`timelines.infoSheet.infoLocal.description`, {
							returnObjects: true,
						}) as string[]
					}
					context={ctx}
					supportedFilters={['source', 'media_only']}
				/>
			);
		case TimelineFetchMode.HOME:
			return (
				<FeedControlView
					title={t(`timelines.infoSheet.infoHome.label`)}
					subtitle={acct?.server}
					description={
						t(`timelines.infoSheet.infoHome.description`, {
							returnObjects: true,
						}) as string[]
					}
					context={ctx}
					supportedFilters={[
						'source',
						'media_only',
						'reply_control',
						'repost_control',
					]}
				/>
			);
		case TimelineFetchMode.BUBBLE: {
			return (
				<FeedControlView
					title={t(`timelines.infoSheet.infoBubble.label`)}
					subtitle={acct?.server}
					description={
						t(`timelines.infoSheet.infoBubble.description`, {
							returnObjects: true,
						}) as string[]
					}
					context={ctx}
					supportedFilters={[]}
				/>
			);
		}
		case TimelineFetchMode.USER:
			return (
				<FeedControlView
					title={t(`timelines.infoSheet.infoUser.label`)}
					subtitle={query.label}
					description={
						t(`timelines.infoSheet.infoUser.description`, {
							returnObjects: true,
						}) as string[]
					}
					context={ctx}
					supportedFilters={['media_only', 'reply_control', 'repost_control']}
				/>
			);
		case TimelineFetchMode.SOCIAL:
			return (
				<FeedControlView
					title={t(`timelines.infoSheet.infoSocial.label`)}
					subtitle={query.label}
					description={
						t(`timelines.infoSheet.infoSocial.description`, {
							returnObjects: true,
						}) as string[]
					}
					context={ctx}
					supportedFilters={[]}
				/>
			);
		case TimelineFetchMode.HASHTAG:
			return (
				<FeedControlView
					title={t(`timelines.infoSheet.infoHashtag.label`)}
					subtitle={query?.label}
					description={
						t(`timelines.infoSheet.infoHashtag.description`, {
							returnObjects: true,
						}) as string[]
					}
					context={ctx}
					supportedFilters={['source', 'media_only']}
				/>
			);
		case TimelineFetchMode.FEDERATED:
			return (
				<FeedControlView
					title={
						[KNOWN_SOFTWARE.PLEROMA, KNOWN_SOFTWARE.AKKOMA].includes(driver)
							? 'Known Network'
							: t(`timelines.infoSheet.infoPublic.label`)
					}
					subtitle={acct?.server}
					description={
						t(`timelines.infoSheet.infoPublic.description`, {
							returnObjects: true,
						}) as string[]
					}
					context={ctx}
					supportedFilters={['source', 'media_only']}
				/>
			);
		case TimelineFetchMode.LIST:
			return (
				<FeedControlView
					title={t(`timelines.infoSheet.infoList.label`)}
					subtitle={acct?.server}
					description={
						t(`timelines.infoSheet.infoList.description`, {
							returnObjects: true,
						}) as string[]
					}
					context={ctx}
					supportedFilters={[]}
				/>
			);
		default:
			throw new Error(`Unknown feed type: ${ctx.feedType}`);
	}
}

export default FeedOptionsBottomSheet;

const styles = StyleSheet.create({
	scrollViewContainer: {
		paddingBottom: 32,
		paddingHorizontal: 10,
	},
});
