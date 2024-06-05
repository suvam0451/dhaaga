import {Animated, RefreshControl, View} from "react-native";
import {
  useActivityPubRestClientContext
} from "../../../../states/useActivityPubRestClient";
import {useQuery} from "@tanstack/react-query";
import React, {useEffect, useRef, useState} from "react";
import TitleOnlyStackHeaderContainer
  from "../../../containers/TitleOnlyStackHeaderContainer";
import WithScrollOnRevealContext, {
  useScrollOnReveal
} from "../../../../states/useScrollOnReveal";
import WithAppPaginationContext, {
  useAppPaginationContext
} from "../../../../states/usePagination";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {Note} from "@dhaaga/shared-provider-misskey/src";
import WithActivitypubStatusContext from "../../../../states/useStatus";
import StatusItem
  from "../../../common/status/StatusItem";
import {useNavigation, useRoute} from "@react-navigation/native";
import WithInfiniteScrollIndicator
  from "../../../containers/WithInfiniteScrollIndicator";
import {AnimatedFlashList} from "@shopify/flash-list";
import NavigationService from "../../../../services/navigation.service";
import LoadingMore from "../../home/LoadingMore";
import TimelinesHeader from "../../../TimelineHeader";
import {EmojiService} from "../../../../services/emoji.service";
import {useRealm} from "@realm/react";
import {useGlobalMmkvContext} from "../../../../states/useGlobalMMkvCache";
import {useSelector} from "react-redux";
import {RootState} from "../../../../libs/redux/store";
import {AccountState} from "../../../../libs/redux/slices/account";
import WithAutoHideTopNavBar from "../../../containers/WithAutoHideTopNavBar";
import diffClamp = Animated.diffClamp;


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
    maxId,
    queryCacheMaxId,
    updateQueryCache,
    clear
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
    const retval = await client.getTrendingPosts({
      limit: 5,
      offset: parseInt(queryCacheMaxId)
    })
    console.log(queryCacheMaxId, retval.map((o) => o.id))
    return retval
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
    }
  }, [fetchStatus]);

  /**
   * Loads next set, when scroll end is reached
   */
  function onPageEndReached() {
    if (PageData.length === 0) return
    if (IsNextPageLoading) return

    setIsNextPageLoading(true)
    updateQueryCache()
    setLoadingMoreComponentProps({
      visible: true,
      loading: true
    })
  }

  function handleScrollJs(e) {
    NavigationService.invokeWhenPageEndReached(e, onPageEndReached)
  }

  const scrollY = useRef(new Animated.Value(0));
  const scrollYClamped = diffClamp(
      scrollY.current,
      0,
      HIDDEN_SECTION_HEIGHT + SHOWN_SECTION_HEIGHT
  );

  const translateY = scrollYClamped.interpolate({
    inputRange: [0, HIDDEN_SECTION_HEIGHT + SHOWN_SECTION_HEIGHT],
    outputRange: [0, -HIDDEN_SECTION_HEIGHT],
  });

  const translateYNumber = useRef();

  translateY.addListener(({value}) => {
    translateYNumber.current = value;
  });

  const handleScrollAnimated = Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {y: scrollY.current},
          },
        },
      ],
      {
        useNativeDriver: true,
        listener: handleScrollJs
      },
  );

  const ref = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    clear()
    refetch();
  }

  return <WithAutoHideTopNavBar title={"Trending Posts"} translateY={translateY}>
    <AnimatedFlashList
        estimatedItemSize={200}
        data={PageData}
        ref={ref}
        renderItem={(o) =>
            <WithActivitypubStatusContext status={o.item} key={o.index}>
              <StatusItem key={o.index}/>
            </WithActivitypubStatusContext>
        }
        onScroll={handleScrollAnimated}
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