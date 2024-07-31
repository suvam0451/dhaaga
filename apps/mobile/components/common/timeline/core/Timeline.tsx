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
import { useGlobalMmkvContext } from '../../../../states/useGlobalMMkvCache';
import { useRealm } from '@realm/react';
import { EmojiService } from '../../../../services/emoji.service';
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

const HIDDEN_SECTION_HEIGHT = 50;
const SHOWN_SECTION_HEIGHT = 50;

/**
 *
 * @returns Timeline rendered for Mastodon
 */
const Timeline = memo(() => {
	const { timelineType, query, opts, setTimelineType } =
		useTimelineController();
	const { client, primaryAcct } = useActivityPubRestClientContext();
	const domain = primaryAcct?.domain;

	const db = useRealm();
	const { globalDb } = useGlobalMmkvContext();
	const {
		data: PageData,
		setMaxId,
		append,
		updateQueryCache,
		queryCacheMaxId,
		clear,
	} = useAppPaginationContext();

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
			setEmojisLoading(true);
			EmojiService.preloadInstanceEmojisForStatuses(
				db,
				globalDb,
				data,
				domain,
			).finally(() => {
				append(data);
				setEmojisLoading(false);
				setPageLoadedAtLeastOnce(true);
			});
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
			const adapted = ActivityPubAdapterService.adaptStatus(o, domain);
			if (adapted.getMediaAttachments().length > 0) {
				return {
					type: ListItemEnum.ListItemWithImage,
					props: {
						post: adapted,
					},
				};
			} else if (adapted.getIsSensitive()) {
				return {
					type: ListItemEnum.ListItemWithSpoiler,
					props: {
						post: adapted,
					},
				};
			} else {
				return {
					type: ListItemEnum.ListItemWithText,
					props: {
						post: adapted,
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
