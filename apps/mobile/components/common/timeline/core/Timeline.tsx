import { memo, useEffect, useMemo, useState } from 'react';
import {
	Animated,
	RefreshControl,
	StatusBar,
	StyleSheet,
	View,
} from 'react-native';
import TimelinesHeader from '../../../TimelineHeader';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import WithAppPaginationContext, {
	useAppPaginationContext,
} from '../../../../states/usePagination';
import LoadingMore from '../../../screens/home/LoadingMore';
import { AnimatedFlashList } from '@shopify/flash-list';
import useLoadingMoreIndicatorState from '../../../../states/useLoadingMoreIndicatorState';
import useScrollMoreOnPageEnd from '../../../../states/useScrollMoreOnPageEnd';
import Introduction from '../../../tutorials/screens/home/new-user/Introduction';
import WithTimelineControllerContext, {
	useTimelineController,
} from '../api/useTimelineController';
import SocialHub from '../fragments/SocialHub';
import usePageRefreshIndicatorState from '../../../../states/usePageRefreshIndicatorState';
import ActivityPubAdapterService from '../../../../services/activitypub-adapter.service';
import useTimeline from '../api/useTimeline';
import useTimelineLabel from '../api/useTimelineLabel';
import { SIDEBAR_VARIANT } from '../../../shared/sidebar/Core';
import { FAB_MENU_MODULES } from '../../../../types/app.types';
import WithAppMenu from '../../../containers/WithAppMenu';
import { APP_THEME } from '../../../../styles/AppTheme';
import { ListItemEnum } from '../utils/itemType.types';
import FlashListRenderer from '../fragments/FlashListRenderer';
import ListHeaderComponent from '../fragments/FlashListHeader';
import { TimelineFetchMode } from '../utils/timeline.types';
import useAppCustomEmoji from '../../../../hooks/app/useAppCustomEmoji';
import activitypubAdapterService from '../../../../services/activitypub-adapter.service';

const HIDDEN_SECTION_HEIGHT = 50;
const SHOWN_SECTION_HEIGHT = 50;

/*
 * Render a Timeline
 */
const Timeline = memo(() => {
	const { timelineType, query, opts, setTimelineType } =
		useTimelineController();
	const { client, primaryAcct } = useActivityPubRestClientContext();
	const domain = primaryAcct?.domain;
	const {
		data: PageData,
		setMaxId,
		append,
		updateQueryCache,
		queryCacheMaxId,
		clear,
	} = useAppPaginationContext();
	const { refresh } = useAppCustomEmoji();

	const [PageLoadedAtLeastOnce, setPageLoadedAtLeastOnce] = useState(false);

	// reset to home
	useEffect(() => {
		setTimelineType(TimelineFetchMode.IDLE);
	}, [primaryAcct]);

	useEffect(() => {
		setPageLoadedAtLeastOnce(false);
		clear();
	}, [timelineType, query, opts]);

	const { fetchStatus, data, status, refetch } = useTimeline({
		type: timelineType,
		query,
		opts,
		maxId: queryCacheMaxId,
	});

	const [EmojisLoading, setEmojisLoading] = useState(false);

	useEffect(() => {
		if (fetchStatus === 'fetching' || status !== 'success') return;

		if (data?.length > 0) {
			setMaxId(data[data.length - 1]?.id);

			const _data = ActivityPubAdapterService.adaptManyStatuses(data, domain);
			append(_data);
			setPageLoadedAtLeastOnce(true);

			/**
			 * Resolve Custom Emojis
			 */
			for (const datum of _data) {
				const _user = activitypubAdapterService.adaptUser(
					datum.getUser(),
					domain,
				);
				const _subdomain = _user.getInstanceUrl();
				if (_subdomain) refresh(_subdomain);

				// handle boosted content
				if (datum.isReposted()) {
					const _userR = activitypubAdapterService.adaptUser(
						datum.getRepostedStatus()?.getUser(),
						domain,
					);
					const _subdomain = _userR.getInstanceUrl();
					if (_subdomain) refresh(_subdomain);
				}
			}
		}
	}, [fetchStatus]);

	const label = useTimelineLabel();

	/**
	 * Composite Hook Collection
	 */
	const { visible, loading } = useLoadingMoreIndicatorState({
		fetchStatus,
		additionalLoadingStates: EmojisLoading,
	});
	const { onScroll, translateY } = useScrollMoreOnPageEnd({
		itemCount: PageData.length,
		updateQueryCache,
	});
	const { onRefresh, refreshing } = usePageRefreshIndicatorState({
		fetchStatus,
		refetch,
	});

	const ListItems = useMemo(() => {
		return PageData.map((o) => {
			if (o.getMediaAttachments().length > 0) {
				return {
					type: ListItemEnum.ListItemWithImage,
					props: {
						post: o,
					},
				};
			} else if (o.getIsSensitive()) {
				return {
					type: ListItemEnum.ListItemWithSpoiler,
					props: {
						post: o,
					},
				};
			} else {
				return {
					type: ListItemEnum.ListItemWithText,
					props: {
						post: o,
					},
				};
			}
		});
	}, [PageData]);

	if (!client) return <Introduction />;

	if (timelineType === TimelineFetchMode.IDLE) return <SocialHub />;

	return (
		<WithAppMenu
			sidebarVariant={SIDEBAR_VARIANT.TIMELINE}
			fabMenuItems={[
				FAB_MENU_MODULES.NAVIGATOR,
				FAB_MENU_MODULES.CREATE_POST,
				FAB_MENU_MODULES.TIMELINE_SWITCHER,
			]}
		>
			<View style={[styles.container, { position: 'relative' }]}>
				<StatusBar backgroundColor={APP_THEME.DARK_THEME_MENUBAR} />
				<Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
					<TimelinesHeader
						SHOWN_SECTION_HEIGHT={SHOWN_SECTION_HEIGHT}
						HIDDEN_SECTION_HEIGHT={HIDDEN_SECTION_HEIGHT}
						label={label}
					/>
				</Animated.View>
				<AnimatedFlashList
					ListHeaderComponent={
						<ListHeaderComponent
							itemCount={ListItems.length}
							loadedOnce={PageLoadedAtLeastOnce}
						/>
					}
					estimatedItemSize={120}
					data={ListItems}
					renderItem={FlashListRenderer}
					getItemType={(o) => o.type}
					onScroll={onScroll}
					contentContainerStyle={{
						paddingTop: SHOWN_SECTION_HEIGHT + 4,
					}}
					scrollEventThrottle={16}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
				/>
				<LoadingMore visible={visible} loading={loading} />
			</View>
		</WithAppMenu>
	);
});

function TimelineWrapper() {
	return (
		<WithTimelineControllerContext>
			<WithAppPaginationContext>
				<Timeline />
			</WithAppPaginationContext>
		</WithTimelineControllerContext>
	);
}

export default TimelineWrapper;

const styles = StyleSheet.create({
	header: {
		position: 'absolute',
		backgroundColor: '#1c1c1c',
		left: 0,
		right: 0,
		width: '100%',
		zIndex: 1,
	},
	subHeader: {
		height: SHOWN_SECTION_HEIGHT,
		width: '100%',
		paddingHorizontal: 10,
	},
	container: {
		flex: 1,
		backgroundColor: '#000',
	},
});
