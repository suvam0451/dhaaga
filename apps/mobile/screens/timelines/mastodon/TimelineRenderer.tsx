import React, {useEffect, useRef, useState} from "react";
import {AccountState} from "../../../libs/redux/slices/account";
import {RootState} from "../../../libs/redux/store";
import {useSelector} from "react-redux";
import {
  Animated, RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from "react-native";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import StatusItem from "../../../components/common/status/StatusItem";
import TimelinesHeader from "../../../components/TimelineHeader";
import {Note} from "@dhaaga/shared-provider-misskey/src";
import {
  useActivityPubRestClientContext
} from "../../../states/useActivityPubRestClient";
import WithActivitypubStatusContext from "../../../states/useStatus";
import WithAppPaginationContext, {
  useAppPaginationContext
} from "../../../states/usePagination";
import LoadingMore from "../../../components/screens/home/LoadingMore";
import {AnimatedFlashList} from "@shopify/flash-list"
import NavigationService from "../../../services/navigation.service";
import {useGlobalMmkvContext} from "../../../states/useGlobalMMkvCache";
import {useRealm} from "@realm/react";
import {EmojiService} from "../../../services/emoji.service";
import useTopbarSmoothTranslate from "../../../states/useTopbarSmoothTranslate";

const HIDDEN_SECTION_HEIGHT = 50;
const SHOWN_SECTION_HEIGHT = 50;


/**
 *
 * @returns Timeline rendered for Mastodon
 */
function TimelineRenderer() {
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const domain = accountState?.activeAccount?.domain
  const {client} = useActivityPubRestClientContext()
  const db = useRealm()
  const {globalDb} = useGlobalMmkvContext()
  const {
    data: PageData,
    setMaxId,
    append,
    maxId,
    clear,
    paginationLock,
    updateQueryCache,
    queryCacheMaxId
  } = useAppPaginationContext()


  const [LoadingMoreComponentProps, setLoadingMoreComponentProps] = useState({
    visible: false,
    loading: false
  });

  const api = () => client ? client.getHomeTimeline({limit: 5, maxId: queryCacheMaxId}) : null

  // Queries
  const {status, data, fetchStatus, refetch} = useQuery<
      mastodon.v1.Status[] | Note[]
  >({
    queryKey: ["mastodon/timelines/home", queryCacheMaxId],
    queryFn: api,
    enabled: client !== null && !paginationLock,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (fetchStatus === "fetching") {
      if (PageData.length > 0) {
        setLoadingMoreComponentProps({
          visible: true,
          loading: true
        })
      }
      return
    }
    if (status !== "success") return

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

    setLoadingMoreComponentProps({
      visible: false,
      loading: false
    })
  }, [fetchStatus]);

  const ref = useRef(null);

  function onPageEndReached() {
    updateQueryCache()
    setLoadingMoreComponentProps({
      visible: true,
      loading: true
    })
  }

  function handleScrollJs(e) {
    NavigationService.invokeWhenPageEndReached(e, onPageEndReached)
  }

  const {onScroll, translateY} = useTopbarSmoothTranslate({
    onScrollJsFn: handleScrollJs,
    totalHeight: HIDDEN_SECTION_HEIGHT + SHOWN_SECTION_HEIGHT,
    hiddenHeight: HIDDEN_SECTION_HEIGHT
  })

  useEffect(() => {
    if (status === "success") {
      setRefreshing(false);
    }
  }, [status, fetchStatus]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    clear()
    refetch();
  }

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
            visible={LoadingMoreComponentProps.visible}
            loading={LoadingMoreComponentProps.loading}
        />
      </SafeAreaView>
  );
}

function TimelineWrapper() {
  return <WithAppPaginationContext>
    <TimelineRenderer/>
  </WithAppPaginationContext>
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
