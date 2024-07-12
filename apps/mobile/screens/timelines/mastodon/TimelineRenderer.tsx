import { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
	Animated,
	RefreshControl,
	StatusBar,
	StyleSheet,
	View,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
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
	useTimelineControllerContext,
} from '../../../states/useTimelineController';
import ActivityPubProviderService from '../../../services/activitypub-provider.service';
import { StatusArray } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/status/_interface';
import WelcomeBack from '../../../components/screens/home/fragments/WelcomeBack';
import TimelineLoading from '../../../components/loading-screens/TimelineLoading';
import usePageRefreshIndicatorState from '../../../states/usePageRefreshIndicatorState';
import TimelineEmpty from '../../../components/error-screen/TimelineEmpty';
import { StatusInterface } from '@dhaaga/shared-abstraction-activitypub';
import ActivityPubAdapterService from '../../../services/activitypub-adapter.service';

const HIDDEN_SECTION_HEIGHT = 50;
const SHOWN_SECTION_HEIGHT = 50;

// A message can be either a text or an image
enum ListItemEnum {
	ListItemWithText,
	ListItemWithImage,
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

type ListItemType = ListItemWithTextInterface | ListItemWithImageInterface;

const ListHeaderComponent = memo(function Foo({
	loadedOnce,
	itemCount,
}: {
	loadedOnce: boolean;
	itemCount: number;
}) {
	if (!loadedOnce) {
		return <TimelineLoading />;
	}
	if (itemCount === 0) {
		return <TimelineEmpty />;
	}
	return <View></View>;
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
	const { timelineType, opts } = useTimelineControllerContext();
	const { client, primaryAcct } = useActivityPubRestClientContext();
	const domain = primaryAcct?.domain;

	const db = useRealm();
	const { globalDb } = useGlobalMmkvContext();
	const {
		data: PageData,
		setMaxId,
		append,
		paginationLock,
		updateQueryCache,
		queryCacheMaxId,
		clear,
	} = useAppPaginationContext();
	const PageLoadedAtLeastOnce = useRef(false);

	useEffect(() => {
		PageLoadedAtLeastOnce.current = false;
		clear();
	}, [timelineType, opts?.listId, opts?.hashtagName, opts?.userId]);

	async function api() {
		return await ActivityPubProviderService.getTimeline(
			client,
			timelineType,
			{
				limit: 5,
				maxId: queryCacheMaxId,
			},
			{
				listQuery: opts?.listId,
				hashtagQuery: opts?.hashtagName,
				userQuery: opts?.userId,
			},
		);
	}

	// Queries
	const { status, data, fetchStatus, refetch } = useQuery<StatusArray>({
		queryKey: [
			'mastodon/timelines/index',
			queryCacheMaxId,
			primaryAcct?._id?.toString(),
			timelineType,
			opts?.listId,
			opts?.hashtagName,
			opts?.userId,
		],
		queryFn: api,
		enabled: client !== null && !paginationLock && timelineType !== 'Idle',
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
				PageLoadedAtLeastOnce.current = true;
			});
		}
	}, [fetchStatus]);

	const Label = useMemo(() => {
		switch (timelineType) {
			case TimelineFetchMode.IDLE: {
				return 'Your Social Hub';
			}
			case TimelineFetchMode.HOME: {
				return 'Home';
			}
			case TimelineFetchMode.LOCAL: {
				return 'Local';
			}
			case TimelineFetchMode.LIST: {
				return `List: ${opts?.listId}`;
			}
			case TimelineFetchMode.HASHTAG: {
				return `#${opts?.hashtagName}`;
			}
			case TimelineFetchMode.USER: {
				return `ID: ${opts?.userId}`;
			}
			case TimelineFetchMode.FEDERATED: {
				return `Federated`;
			}
			default: {
				return 'Unassigned';
			}
		}
	}, [timelineType, opts?.hashtagName, opts?.listId]);

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
		<View style={[styles.container, { position: 'relative' }]}>
			<StatusBar backgroundColor="#121212" />
			<Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
				<TimelinesHeader
					SHOWN_SECTION_HEIGHT={SHOWN_SECTION_HEIGHT}
					HIDDEN_SECTION_HEIGHT={HIDDEN_SECTION_HEIGHT}
					label={Label}
				/>
			</Animated.View>
			<AnimatedFlashList
				ListHeaderComponent={
					<ListHeaderComponent
						itemCount={ListItems.length}
						loadedOnce={PageLoadedAtLeastOnce.current}
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
