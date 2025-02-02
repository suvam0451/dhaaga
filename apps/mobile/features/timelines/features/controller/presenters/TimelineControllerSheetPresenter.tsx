import {
	useAppAcct,
	useAppBottomSheet,
	useAppBottomSheet_TimelineReference,
} from '../../../../../hooks/utility/global-state-extractors';
import { Fragment, useEffect, useMemo, useRef } from 'react';
import { TimelineFetchMode } from '../../../../../states/interactors/post-timeline.reducer';
import BubbleTimelineController from '../../../../../components/widgets/feed-controller/controllers/BubbleTimelineController';
import OverviewView from '../views/OverviewView';
import SocialTimelineController from '../../../../../components/widgets/feed-controller/controllers/SocialTimelineController';
import TagTimelineControlPresenter from './TagTimelineControlPresenter';
import FederatedTimelineController from '../../../../../components/widgets/feed-controller/controllers/FederatedTimelineController';
import ListTimelineController from '../../../../../components/widgets/feed-controller/controllers/ListTimelineController';
import { ScrollView, Text, View } from 'react-native';
import { AppDivider } from '../../../../../components/lib/Divider';
import MenuView from '../views/MenuView';
import LocalTimelineControlPresenter from './LocalTimelineControlPresenter';
import useTimelineControllerInteractor from '../interactors/useTimelineControllerInteractor';
import UserTimelineControlPresenter from './UserTimelineControlPresenter';

function TimelineControllerSheetPresenter() {
	const { draft } = useAppBottomSheet_TimelineReference();
	const { acct } = useAppAcct();
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
				broadcastChanges();
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
							title={'Local Timeline'}
							subtitle={acct?.server}
							description={[
								'This timeline displays posts from you and other users in your instance',
							]}
						/>
						<AppDivider.Hard
							style={{
								marginHorizontal: 10,
								marginVertical: 8,
								backgroundColor: '#2c2c2c',
							}}
						/>
						<LocalTimelineControlPresenter />
					</Fragment>
				);
			}
			case TimelineFetchMode.BUBBLE:
				return <BubbleTimelineController />;
			case TimelineFetchMode.HOME:
				return (
					<OverviewView
						title={'Home Timeline'}
						subtitle={acct?.server}
						description={[
							'This is your home timeline.',
							'You can see posts from yourself and everyone you follow here.',
						]}
					/>
				);
			case TimelineFetchMode.USER: {
				return (
					<Fragment>
						<OverviewView
							title={'User Timeline'}
							subtitle={draft?.query?.label}
							description={[
								'This is a user timeline.',
								'You can see posts, boosts and replies from the selected user here.',
							]}
						/>
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
				return <SocialTimelineController />;
			case TimelineFetchMode.HASHTAG: {
				return (
					<Fragment>
						<OverviewView
							title={'Hashtag Timeline'}
							subtitle={draft?.query?.label}
							description={[
								'This is a hashtag timeline.',
								'You can see a list of all posts made using this hashtag here.',
							]}
						/>
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
			case TimelineFetchMode.FEDERATED:
				return <FederatedTimelineController />;
			case TimelineFetchMode.LIST: {
				return <ListTimelineController />;
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

	function onOpenInBrowser() {}
	return (
		<ScrollView contentContainerStyle={{ paddingBottom: 32, paddingTop: 36 }}>
			<View style={{ marginHorizontal: 12, marginBottom: 16 }}>{Comp}</View>;
			<AppDivider.Hard
				style={{
					marginHorizontal: 10,
					marginVertical: 8,
					backgroundColor: '#2c2c2c',
				}}
			/>
			<MenuView onOpenInBrowser={onOpenInBrowser} />
		</ScrollView>
	);
}

export default TimelineControllerSheetPresenter;
