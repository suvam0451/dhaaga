import React, {useEffect, useRef, useState} from "react";
import {AccountState} from "../../../libs/redux/slices/account";
import {RootState} from "../../../libs/redux/store";
import {useSelector} from "react-redux";
import {
  Animated,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet, View,
} from "react-native";
import {getCloser} from "../../../utils";
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
import NavigationService from "../../../services/navigation.service";
import {EmojiService} from "../../../services/emoji.service";

const {diffClamp} = Animated;
const HIDDEN_SECTION_HEIGHT = 50;
const SHOWN_SECTION_HEIGHT = 50;


function Content() {
  const {data: PageData} = useAppPaginationContext()

  if (!PageData) return <View></View>
  return <>
    {PageData.map((o: mastodon.v1.Status | Note, i) =>
        <WithActivitypubStatusContext status={o} key={i}>
          <StatusItem key={i}/>
        </WithActivitypubStatusContext>)}
  </>
}

/**
 *
 * @returns Timeline rendered for Mastodon
 */
function TimelineRenderer() {
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const {client} = useActivityPubRestClientContext()
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

  const api = () => client ? client.getHomeTimeline({limit: 5, maxId}) : null

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

    if (status === "success" && data.length > 0) {
      setMaxId(data[data.length - 1]?.id)
      append(data)
    }

    setLoadingMoreComponentProps({
      visible: false,
      loading: false
    })
  }, [fetchStatus]);

  /**
   * Load global emoji database
   */
  useEffect(() => {
    if (accountState.activeAccount?.domain) {
      const url = accountState.activeAccount.subdomain;
      EmojiService.updateEmojiCacheForDomain(url);
    }
  }, [accountState]);

  const ref = useRef(null);

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

  const handleScroll = Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {y: scrollY.current},
          },
        },
      ],
      {
        useNativeDriver: true,
      }
  );

  function onPageEndReached() {
    console.log("[INFO]: page end reached. performing refetch")
    updateQueryCache()
    refetch()
    setLoadingMoreComponentProps({
      visible: true,
      loading: true
    })
  }

  /**
   * When scroll view has stopped moving,
   * snap to the nearest section
   * @param param0
   */
  const handleSnap = ({nativeEvent}) => {
    const offsetY = nativeEvent.contentOffset.y;
    if (
        !(
            translateYNumber.current === 0 ||
            translateYNumber.current === -HIDDEN_SECTION_HEIGHT
        )
    ) {
      if (ref.current) {
        try {
          /**
           * ScrollView --> scroll ???
           * FlatView --> scrollToOffset({offset: number}})
           */
          ref.current.scrollTo({
            // applies only for flat list
            offset:
                getCloser(translateYNumber.current, -HIDDEN_SECTION_HEIGHT, 0) ===
                -HIDDEN_SECTION_HEIGHT
                    ? offsetY + HIDDEN_SECTION_HEIGHT
                    : offsetY - HIDDEN_SECTION_HEIGHT,
          });
        } catch (e) {
          console.log("[WARN]: component is not a flat list");
        }
      }
    }
  };

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

    const subdomain = accountState.activeAccount?.domain;
    if (subdomain) {
      EmojiService.updateEmojiCacheForDomain(subdomain);
    }
  }

  return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#121212"/>
        <Animated.View style={[styles.header, {transform: [{translateY}]}]}>
          <TimelinesHeader
              SHOWN_SECTION_HEIGHT={SHOWN_SECTION_HEIGHT}
              HIDDEN_SECTION_HEIGHT={HIDDEN_SECTION_HEIGHT}
          />
        </Animated.View>

        <Animated.ScrollView
            contentContainerStyle={{
              paddingTop: SHOWN_SECTION_HEIGHT + HIDDEN_SECTION_HEIGHT,
            }}
            onScroll={(e) => {
              NavigationService.invokeWhenPageEndReached(e, onPageEndReached)
              return handleScroll
            }}
            ref={ref}
            contentInset={{
              top: SHOWN_SECTION_HEIGHT + HIDDEN_SECTION_HEIGHT + 1000,
            }}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
            }
        >
          <Content/>
          <LoadingMore visible={LoadingMoreComponentProps.visible}
                       loading={LoadingMoreComponentProps.loading}
          />
        </Animated.ScrollView>
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
