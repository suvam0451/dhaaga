import {RefreshControl} from "react-native";
import {
  useActivityPubRestClientContext
} from "../../../../states/useActivityPubRestClient";
import {useQuery} from "@tanstack/react-query";
import React, {useEffect, useRef, useState} from "react";
import WithScrollOnRevealContext from "../../../../states/useScrollOnReveal";
import WithAppPaginationContext, {
  useAppPaginationContext
} from "../../../../states/usePagination";
import WithActivitypubStatusContext from "../../../../states/useStatus";
import StatusItem from "../../../common/status/StatusItem";
import {AnimatedFlashList} from "@shopify/flash-list";
import NavigationService from "../../../../services/navigation.service";
import LoadingMore from "../../home/LoadingMore";
import {EmojiService} from "../../../../services/emoji.service";
import {useRealm} from "@realm/react";
import {useGlobalMmkvContext} from "../../../../states/useGlobalMMkvCache";
import {useSelector} from "react-redux";
import {RootState} from "../../../../libs/redux/store";
import {AccountState} from "../../../../libs/redux/slices/account";
import WithAutoHideTopNavBar from "../../../containers/WithAutoHideTopNavBar";
import useTopbarSmoothTranslate
  from "../../../../states/useTopbarSmoothTranslate";


const SHOWN_SECTION_HEIGHT = 50;
const HIDDEN_SECTION_HEIGHT = 50;

/**
 * Search Module -- Trending Posts
 */
function ApiWrapper() {
  const {client} = useActivityPubRestClientContext()
  const {
    data: PageData,
    setMaxId,
    append,
    queryCacheMaxId,
    updateQueryCache,
    clear,
    maxId
  } = useAppPaginationContext()
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const domain = accountState?.activeAccount?.domain
  const db = useRealm()
  const {globalDb} = useGlobalMmkvContext()
  const [IsNextPageLoading, setIsNextPageLoading] = useState(false)

  const [LoadingMoreComponentProps, setLoadingMoreComponentProps] = useState({
    visible: false,
    loading: false
  });

  async function api() {
    if (!client) return null
    return await client.getTrendingPosts({
      limit: 5,
      offset: parseInt(queryCacheMaxId)
    })
  }

  // Queries
  const {status, data, fetchStatus, refetch} = useQuery({
    queryKey: ["trending/posts", queryCacheMaxId],
    queryFn: api,
    enabled: client !== null,
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


    if (status !== "success" || !data || data.length === 0) return
    if (data.length > 0) {
      setMaxId((PageData.length + data.length).toString())
      EmojiService.preloadInstanceEmojisForStatuses(
          db,
          globalDb,
          data,
          domain)
          .then((res) => {
          }).finally(() => {
        append(data)
        setLoadingMoreComponentProps({
          visible: false,
          loading: false
        })
        setIsNextPageLoading(false)
      })
    } else {
      setIsNextPageLoading(false)
    }
  }, [fetchStatus]);

  /**
   * Loads next set, when scroll end is reached
   */
  const onPageEndReached = () => {
    if (PageData.length === 0) return
    if (IsNextPageLoading) return

    setIsNextPageLoading(true)
    updateQueryCache()
    setLoadingMoreComponentProps({
      visible: true,
      loading: true
    })
  }

  const handleScrollJs = (e: any) => {
    NavigationService.invokeWhenPageEndReached(e, onPageEndReached)
  }

  const {onScroll, translateY} = useTopbarSmoothTranslate({
    onScrollJsFn: handleScrollJs,
    totalHeight: HIDDEN_SECTION_HEIGHT + SHOWN_SECTION_HEIGHT,
    hiddenHeight: HIDDEN_SECTION_HEIGHT
  })

  const ref = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    clear()
    refetch();
  }

  return <WithAutoHideTopNavBar
      title={"Trending Posts"}
      translateY={translateY}>
    <AnimatedFlashList
        estimatedItemSize={200}
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
  </WithAutoHideTopNavBar>
}

function TrendingPostsContainer() {
  return <WithScrollOnRevealContext maxDisplacement={150}>
    <WithAppPaginationContext>
      <ApiWrapper/>
    </WithAppPaginationContext>
  </WithScrollOnRevealContext>
}

export default TrendingPostsContainer