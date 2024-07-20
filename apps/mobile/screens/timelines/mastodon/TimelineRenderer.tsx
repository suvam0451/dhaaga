import { Fragment, memo, useEffect, useMemo, useState } from 'react';
import {
	Animated,
	RefreshControl,
	StatusBar,
	StyleSheet,
	View,
} from 'react-native';
import StatusItem from '../../../components/common/status/StatusItem';
import TimelinesHeader from '../../../components/TimelineHeader';
import { useActivityPubRestClientContext } from '../../../states/useActivityPubRestClient';
import WithActivitypubStatusContext from '../../../states/useStatus';
import WithAppPaginationContext, {
	useAppPaginationContext,
} from '../../../states/usePagination';
import LoadingMore from '../../../components/screens/home/LoadingMore';
import { AnimatedFlashList } from '@shopify/flash-list';
import { useGlobalMmkvContext } from '../../../states/useGlobalMMkvCache';
import { useRealm } from '@realm/react';
import { EmojiService } from '../../../services/emoji.service';
import useLoadingMoreIndicatorState from '../../../states/useLoadingMoreIndicatorState';
import useScrollMoreOnPageEnd from '../../../states/useScrollMoreOnPageEnd';
import Introduction from '../../../components/tutorials/screens/home/new-user/Introduction';
import WithTimelineControllerContext, {
	TimelineFetchMode,
	useTimelineController,
} from '../../../states/useTimelineController';
import WelcomeBack from '../../../components/screens/home/fragments/WelcomeBack';
import TimelineLoading from '../../../components/loading-screens/TimelineLoading';
import usePageRefreshIndicatorState from '../../../states/usePageRefreshIndicatorState';
import TimelineEmpty from '../../../components/error-screen/TimelineEmpty';
import { StatusInterface } from '@dhaaga/shared-abstraction-activitypub';
import ActivityPubAdapterService from '../../../services/activitypub-adapter.service';
import NowBrowsingHeader from '../../../components/widgets/feed-controller/core/NowBrowsingHeader';
import { TimelineType } from '../../../types/timeline.types';
import useTimeline from '../../../states/useTimeline';
import useTimelineLabel from '../../../components/common/timeline/utils';
import { SIDEBAR_VARIANT } from '../../../components/shared/sidebar/Core';
import { FAB_MENU_MODULES } from '../../../types/app.types';
import WithAppMenu from '../../../components/containers/WithAppMenu';

const HIDDEN_SECTION_HEIGHT = 50;
const SHOWN_SECTION_HEIGHT = 50;

// A message can be either a text or an image
enum ListItemEnum {
	ListItemWithText,
	ListItemWithImage,
	ListItemWithSpoiler,
}

interface ListItemWithTextInterface {
	props: {
		post: StatusInterface;
	};
	type: ListItemEnum.ListItemWithText;
}

interface ListItemWithImageInterface {
	props: {
		post: StatusInterface;
	};
	type: ListItemEnum.ListItemWithImage;
}

interface ListItemWithSpoilerInterface {
	props: {
		post: StatusInterface;
	};
	type: ListItemEnum.ListItemWithSpoiler;
}

type ListItemType =
	| ListItemWithTextInterface
	| ListItemWithImageInterface
	| ListItemWithSpoilerInterface;

const ListHeaderComponent = memo(function Foo({
	loadedOnce,
	itemCount,
}: {
	loadedOnce: boolean;
	itemCount: number;
}) {
	const AdditionalState = useMemo(() => {
		if (!loadedOnce) {
			return <View />;
			// return <TimelineLoading />;
		}
		if (itemCount === 0) {
			return <TimelineEmpty />;
		}
		return <View />;
	}, [loadedOnce, itemCount]);

	return (
		<Fragment>
			<NowBrowsingHeader />
			{AdditionalState}
		</Fragment>
	);
});

const FlashListRenderer = ({ item }: { item: ListItemType }) => {
	switch (item.type) {
		case ListItemEnum.ListItemWithImage: {
			return (
				<WithActivitypubStatusContext statusInterface={item.props.post}>
					<StatusItem />
				</WithActivitypubStatusContext>
			);
		}
		case ListItemEnum.ListItemWithText: {
			return (
				<WithActivitypubStatusContext statusInterface={item.props.post}>
					<StatusItem />
				</WithActivitypubStatusContext>
			);
		}
	}
};

/**
 *
 * @returns Timeline rendered for Mastodon
 */
function TimelineRenderer() {
	const { timelineType, query, opts } = useTimelineController();
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

	if (timelineType === TimelineFetchMode.IDLE) return <WelcomeBack />;

	return (
		<WithAppMenu
			sidebarVariant={SIDEBAR_VARIANT.TIMELINE}
			fabMenuItems={[
				FAB_MENU_MODULES.NAVIGATOR,
				FAB_MENU_MODULES.CREATE_POST,
				FAB_MENU_MODULES.TIMELINE_SWITCHER,
				FAB_MENU_MODULES.OPEN_SIDEBAR,
			]}
		>
			<View style={[styles.container, { position: 'relative' }]}>
				<StatusBar backgroundColor="#121212" />
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
}

function TimelineWrapper() {
	return (
		<WithTimelineControllerContext>
			<WithAppPaginationContext>
				<TimelineRenderer />
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
