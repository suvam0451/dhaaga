import {
	useAppAcct,
	useAppApiClient,
	useAppBottomSheet,
	useAppBottomSheet_TimelineReference,
	useAppTheme,
} from '../../../../../hooks/utility/global-state-extractors';
import { Fragment, useEffect, useMemo, useRef } from 'react';
import { TimelineFetchMode } from '../../../../../states/interactors/post-timeline.reducer';
import OverviewView from '../views/OverviewView';
import TagTimelineControlPresenter from './TagTimelineControlPresenter';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { AppDivider } from '../../../../../components/lib/Divider';
import MenuView from '../views/MenuView';
import LocalTimelineControlPresenter from './LocalTimelineControlPresenter';
import useTimelineControllerInteractor from '../interactors/useTimelineControllerInteractor';
import UserTimelineControlPresenter from './UserTimelineControlPresenter';
import { useTranslation } from 'react-i18next';
import { LOCALIZATION_NAMESPACE } from '../../../../../types/app.types';
import { KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { appDimensions } from '../../../../../styles/dimensions';
import { AtprotoService } from '../../../../../services/atproto.service';
import { LinkingUtils } from '../../../../../utils/linking.utils';
import SyncStatusPresenter from '../../../../feeds/presenters/SyncStatusPresenter';
import ProfileFeedAssignInteractor from '../../../../app-profiles/interactors/ProfileFeedAssignInteractor';

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

function TimelineControllerSheetPresenter() {
	const { draft } = useAppBottomSheet_TimelineReference();
	const { acct } = useAppAcct();
	const { driver, client } = useAppApiClient();
	const { endSessionSeed, stateId } = useAppBottomSheet();
	const {
		onFeedOptSelected,
		FeedOpt,
		MediaOpt,
		onMediaOptSelected,
		onMediaOptAllSelected,
		State,
		HideReposts,
		HideReplies,
		updateLocalState,
		broadcastChanges,
		setHideReposts,
		setHideReplies,
		onFeedOptAllSelected,
	} = useTimelineControllerInteractor();
	const { t } = useTranslation([LOCALIZATION_NAMESPACE.SHEETS]);

	/**
	 * Broadcast the timeline query changes
	 * when the bottom sheet is closed
	 */
	const endSessionSeedRef = useRef(null);
	const stateIdRef = useRef(null);
	useEffect(() => {
		if (stateIdRef.current && stateIdRef.current === stateId) {
			if (
				endSessionSeedRef.current &&
				endSessionSeedRef.current !== endSessionSeed
			) {
				/**
				 * 	prevent end session callback
				 * 	where not applicable
				 */
				if (
					[TimelineFetchMode.FEED, TimelineFetchMode.HOME].includes(
						draft.feedType,
					)
				) {
				} else {
					broadcastChanges();
				}
			}
		} else {
			stateIdRef.current = stateId;
			endSessionSeedRef.current = endSessionSeed;
		}
	}, [stateId, endSessionSeed]);

	function onClickHideReply() {
		setHideReplies((o) => !o);
		updateLocalState();
	}

	function onClickHideReblog() {
		setHideReposts((o) => !o);
		updateLocalState();
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
						<Divider />
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
						<Divider />
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
						<Divider />
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
	}, [draft.feedType, State]);

	function onOpenInBrowser() {
		switch (draft.feedType) {
			case 'Feed': {
				AtprotoService.generateFeedRemoteUrl(
					client as any,
					draft.query.id,
				).then((result) => {
					if (result.type === 'success') {
						console.log(result.value.url);
						LinkingUtils.openURL(result.value.url);
					}
				});
				break;
			}
		}
		// https://bsky.app/profile/skyfeed.xyz/feed/mutuals
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
								<Divider />
							</View>
						}
						Footer={
							<View style={{ marginBottom: 32 }}>
								<Divider />
								<MenuView onOpenInBrowser={onOpenInBrowser} />
							</View>
						}
					/>
				);
			default:
				return undefined;
		}
	}, [draft.feedType, draft?.query, State]);

	if (BottomComp) return <View style={{ flex: 1 }}>{BottomComp}</View>;

	return (
		<ScrollView contentContainerStyle={styles.scrollViewContainer}>
			{Comp}
			<Divider />
			<MenuView onOpenInBrowser={onOpenInBrowser} />
		</ScrollView>
	);
}

export default TimelineControllerSheetPresenter;

const styles = StyleSheet.create({
	scrollViewContainer: {
		// flex: 1,
		paddingBottom: 32,
	},
});
