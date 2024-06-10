import React, {useEffect, useRef} from "react";
import {
  Animated,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from "react-native";
import {keepPreviousData, useQuery,} from "@tanstack/react-query";
import StatusItem from "../../../components/common/status/StatusItem";
import TimelinesHeader from "../../../components/TimelineHeader";
import {
  useActivityPubRestClientContext
} from "../../../states/useActivityPubRestClient";
import WithActivitypubStatusContext from "../../../states/useStatus";
import WithAppPaginationContext, {
  useAppPaginationContext
} from "../../../states/usePagination";
import LoadingMore from "../../../components/screens/home/LoadingMore";
import {AnimatedFlashList} from "@shopify/flash-list"
import {useGlobalMmkvContext} from "../../../states/useGlobalMMkvCache";
import {useRealm} from "@realm/react";
import {EmojiService} from "../../../services/emoji.service";
import usePageRefreshIndicatorState
  from "../../../states/usePageRefreshIndicatorState";
import useLoadingMoreIndicatorState
  from "../../../states/useLoadingMoreIndicatorState";
import useScrollMoreOnPageEnd from "../../../states/useScrollMoreOnPageEnd";
import Introduction
  from "../../../components/tutorials/screens/home/new-user/Introduction";
import WithTimelineControllerContext, {
  TimelineFetchMode,
  useTimelineControllerContext
} from "../../../states/useTimelineController";
import ActivityPubProviderService
  from "../../../services/activitypub-provider.service";
import {
  StatusArray
} from "@dhaaga/shared-abstraction-activitypub/src/adapters/status/_interface";
import WelcomeBack
  from "../../../components/screens/home/fragments/WelcomeBack";

const HIDDEN_SECTION_HEIGHT = 50;
const SHOWN_SECTION_HEIGHT = 50;


/**
 *
 * @returns Timeline rendered for Mastodon
 */
function TimelineRenderer() {
  const {timelineType} = useTimelineControllerContext()
  const {client, primaryAcct} = useActivityPubRestClientContext()
  const domain = primaryAcct?.domain

  const db = useRealm()
  const {globalDb} = useGlobalMmkvContext()
  const {
    data: PageData,
    setMaxId,
    append,
    paginationLock,
    updateQueryCache,
    queryCacheMaxId
  } = useAppPaginationContext()

  async function api() {
    return await ActivityPubProviderService.getTimeline(client, timelineType, {
      limit: 5,
      maxId: queryCacheMaxId
    }, {})
  }

  // Queries
  const {status, data, error, fetchStatus, refetch} = useQuery<
      StatusArray
  >({
    queryKey: ["mastodon/timelines/home", queryCacheMaxId, primaryAcct?._id?.toString()],
    queryFn: api,
    enabled: client !== null && !paginationLock,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (fetchStatus === "fetching" || status !== "success") return

    if (status === "success" && data && data.length > 0) {
      setMaxId(data[data.length - 1]?.id)
      EmojiService.preloadInstanceEmojisForStatuses(
          db,
          globalDb,
          data,
          domain)
          .then((res) => {
          }).finally(() => {
        append(data)
      })
    }
  }, [fetchStatus]);

  const ref = useRef(null);

  /**
   * Composite Hook Collection
   */
  const {visible, loading} = useLoadingMoreIndicatorState({fetchStatus})
  const {onScroll, translateY} = useScrollMoreOnPageEnd({
    itemCount: PageData.length, updateQueryCache
  })
  const {onRefresh, refreshing} = usePageRefreshIndicatorState({
    fetchStatus,
    refetch
  })

  if (!client) return <Introduction/>

  if (timelineType === TimelineFetchMode.IDLE) return <WelcomeBack/>

  return (
      <SafeAreaView style={[styles.container, {position: "relative"}]}>
        <StatusBar backgroundColor="#222222"/>
        <Animated.View style={[styles.header, {transform: [{translateY}]}]}>
          <TimelinesHeader
              SHOWN_SECTION_HEIGHT={SHOWN_SECTION_HEIGHT}
              HIDDEN_SECTION_HEIGHT={HIDDEN_SECTION_HEIGHT}
          />
        </Animated.View>
        <AnimatedFlashList
            estimatedItemSize={100}
            data={PageData}
            ref={ref}
            renderItem={(o) =>
                <WithActivitypubStatusContext status={o.item} key={o.index}>
                  <StatusItem key={o.index}/>
                </WithActivitypubStatusContext>
            }
            onScroll={onScroll}
            contentContainerStyle={{
              paddingTop: SHOWN_SECTION_HEIGHT + 4,
            }}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}/>
            }
        />
        <LoadingMore
            visible={visible}
            loading={loading}
        />
      </SafeAreaView>
  );
}

function TimelineWrapper() {
  return <WithTimelineControllerContext>
    <WithAppPaginationContext>
      <TimelineRenderer/>
    </WithAppPaginationContext>
  </WithTimelineControllerContext>
}

export default TimelineWrapper;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    backgroundColor: "#1c1c1c",
    left: 0,
    right: 0,
    width: "100%",
    zIndex: 1,
  },
  subHeader: {
    height: SHOWN_SECTION_HEIGHT,
    width: "100%",
    paddingHorizontal: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
