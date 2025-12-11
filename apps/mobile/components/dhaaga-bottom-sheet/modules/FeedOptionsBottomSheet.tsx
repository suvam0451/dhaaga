import { useActiveUserSession, useAppApiClient } from '#/states/global/hooks';
import { Fragment, useMemo } from 'react';
import { TimelineFetchMode } from '@dhaaga/core';
import OverviewView from '#/features/timelines/features/controller/views/OverviewView';
import TagTimelineControlPresenter from '#/features/timelines/features/controller/presenters/TagTimelineControlPresenter';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import MenuView from '#/features/timelines/features/controller/views/MenuView';
import LocalTimelineControlPresenter from '#/features/timelines/features/controller/presenters/LocalTimelineControlPresenter';
import useTimelineControllerInteractor from '#/features/timelines/features/controller/interactors/useTimelineControllerInteractor';
import UserTimelineControlPresenter from '#/features/timelines/features/controller/presenters/UserTimelineControlPresenter';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '#/types/app.types';
import {
	AtprotoApiAdapter,
	AtprotoUtils,
	KNOWN_SOFTWARE,
} from '@dhaaga/bridge';
import { LinkingUtils } from '#/utils/linking.utils';
import SyncStatusPresenter from '#/features/feeds/presenters/SyncStatusPresenter';
import ProfileFeedAssignInteractor from '#/features/app-profiles/interactors/ProfileFeedAssignInteractor';
import { AppDividerHard } from '#/ui/Divider';

function FeedOptionsBottomSheet() {
	const { draft } = useAppBottomSheet_TimelineReference();
	const { acct } = useActiveUserSession();
	const { driver, client } = useAppApiClient();
	const {
		onFeedOptSelected,
		FeedOpt,
		MediaOpt,
		onMediaOptSelected,
		onMediaOptAllSelected,
		HideReposts,
		HideReplies,
		broadcastChanges,
		setHideReposts,
		setHideReplies,
		onFeedOptAllSelected,
	} = useTimelineControllerInteractor();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SHEETS]);

	function onClickHideReply() {
		setHideReplies((o) => !o);
	}

	function onClickHideReblog() {
		setHideReposts((o) => !o);
	}

	const Comp = useMemo(() => {
		switch (draft.feedType) {
			case TimelineFetchMode.LOCAL: {
				return (
					<Fragment>
						<OverviewView
							title={t(`timelines.infoSheet.infoLocal.label`)}
							subtitle={acct?.server}
							description={
								t(`timelines.infoSheet.infoLocal.description`, {
									returnObjects: true,
								}) as string[]
							}
						/>
						<AppDividerHard />
						<LocalTimelineControlPresenter />
					</Fragment>
				);
			}
			case TimelineFetchMode.BUBBLE:
				return (
					<OverviewView
						title={t(`timelines.infoSheet.infoBubble.label`)}
						subtitle={acct?.server}
						description={
							t(`timelines.infoSheet.infoBubble.description`, {
								returnObjects: true,
							}) as string[]
						}
					/>
				);
			case TimelineFetchMode.HOME:
				return (
					<OverviewView
						title={t(`timelines.infoSheet.infoHome.label`)}
						subtitle={acct?.server}
						description={
							t(`timelines.infoSheet.infoHome.description`, {
								returnObjects: true,
							}) as string[]
						}
					/>
				);
			case TimelineFetchMode.USER: {
				return (
					<Fragment>
						<OverviewView
							title={t(`timelines.infoSheet.infoUser.label`)}
							subtitle={draft?.query?.label}
							description={
								t(`timelines.infoSheet.infoUser.description`, {
									returnObjects: true,
								}) as string[]
							}
						/>
						<AppDividerHard />
						<UserTimelineControlPresenter
							onClickHideReblog={onClickHideReblog}
							onClickHideReply={onClickHideReply}
							MediaOpt={MediaOpt}
							hash={State}
							HideReplies={HideReplies}
							HideReposts={HideReposts}
							onMediaOptSelected={onMediaOptSelected}
							onMediaOptAllSelected={onMediaOptAllSelected}
						/>
					</Fragment>
				);
			}
			case TimelineFetchMode.SOCIAL:
				return (
					<OverviewView
						title={t(`timelines.infoSheet.infoSocial.label`)}
						subtitle={draft?.query?.label}
						description={
							t(`timelines.infoSheet.infoSocial.description`, {
								returnObjects: true,
							}) as string[]
						}
					/>
				);
			case TimelineFetchMode.HASHTAG: {
				return (
					<Fragment>
						<OverviewView
							title={t(`timelines.infoSheet.infoHashtag.label`)}
							subtitle={draft?.query?.label}
							description={
								t(`timelines.infoSheet.infoHashtag.description`, {
									returnObjects: true,
								}) as string[]
							}
						/>
						<AppDividerHard />
						<TagTimelineControlPresenter
							MediaOpt={MediaOpt}
							onMediaOptSelected={onMediaOptSelected}
							onMediaOptAllSelected={onMediaOptAllSelected}
							hash={State}
							FeedOpt={FeedOpt}
							onFeedOptSelected={onFeedOptSelected}
							onFeedOptAllSelected={onFeedOptAllSelected}
						/>
					</Fragment>
				);
			}
			case TimelineFetchMode.FEED:
				return (
					<Fragment>
						<OverviewView
							title={t(`timelines.infoSheet.infoFeed.label`)}
							subtitle={draft?.query?.label}
							description={
								t(`timelines.infoSheet.infoFeed.description`, {
									returnObjects: true,
								}) as string[]
							}
						/>
						<SyncStatusPresenter uri={draft?.query?.id} />
					</Fragment>
				);
			case TimelineFetchMode.FEDERATED:
				return (
					<OverviewView
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
					/>
				);
			case TimelineFetchMode.LIST: {
				return (
					<OverviewView
						title={t(`timelines.infoSheet.infoList.label`)}
						subtitle={acct?.server}
						description={
							t(`timelines.infoSheet.infoList.description`, {
								returnObjects: true,
							}) as string[]
						}
					/>
				);
			}
			default: {
				return (
					<View>
						<Text>Unsupported timeline type</Text>
					</View>
				);
			}
		}
	}, [draft.feedType]);

	function onOpenInBrowser() {
		switch (draft.feedType) {
			case 'Feed': {
				AtprotoUtils.generateFeedUrl(
					client as AtprotoApiAdapter,
					draft.query.id,
				).then((o) => {
					LinkingUtils.openURL(o);
				});
				break;
			}
		}
	}

	const BottomComp = useMemo(() => {
		switch (draft.feedType) {
			case TimelineFetchMode.FEED:
				return (
					<ProfileFeedAssignInteractor
						uri={draft?.query?.id}
						Header={
							<View>
								<OverviewView
									title={t(`timelines.infoSheet.infoFeed.label`)}
									subtitle={draft?.query?.label}
									description={
										t(`timelines.infoSheet.infoFeed.description`, {
											returnObjects: true,
										}) as string[]
									}
								/>
								<View style={{ marginHorizontal: 12 }}>
									<SyncStatusPresenter uri={draft?.query?.id} />
								</View>
								<AppDividerHard />
							</View>
						}
						Footer={
							<View style={{ marginBottom: 32 }}>
								<AppDividerHard />
								<MenuView onOpenInBrowser={onOpenInBrowser} />
							</View>
						}
					/>
				);
			default:
				return undefined;
		}
	}, [draft.feedType, draft?.query]);

	if (BottomComp) return <View style={{ flex: 1 }}>{BottomComp}</View>;

	return (
		<ScrollView contentContainerStyle={styles.scrollViewContainer}>
			{Comp}
			<AppDividerHard />
			<MenuView onOpenInBrowser={onOpenInBrowser} />
		</ScrollView>
	);
}

export default FeedOptionsBottomSheet;

const styles = StyleSheet.create({
	scrollViewContainer: {
		// flex: 1,
		paddingBottom: 32,
	},
});
