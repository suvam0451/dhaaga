import {useCallback, useEffect, useRef, useState} from "react";
import {AccountState} from "../../../libs/redux/slices/account";
import {RootState} from "../../../libs/redux/store";
import {useSelector} from "react-redux";
import {
  Animated,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
} from "react-native";
import {getCloser} from "../../../utils";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {useQuery} from "@tanstack/react-query";
import StatusFragment from "../fragments/StatusFragment";
import TimelinesHeader from "../../../components/TimelineHeader";
import {Note} from "@dhaaga/shared-provider-misskey/src";
import axios from "axios";
import {CacheRepo} from "../../../libs/sqlite/repositories/cache/cache.repo";
import {
  useActivityPubRestClientContext
} from "../../../states/useActivityPubRestClient";
import WithActivitypubStatusContext from "../../../states/useStatus";

const {diffClamp} = Animated;
const HIDDEN_SECTION_HEIGHT = 50;
const SHOWN_SECTION_HEIGHT = 50;

/**
 *
 * @returns Timeline rendered for Mastodon
 */
function TimelineRenderer() {
  const accountState = useSelector<RootState, AccountState>((o) => o.account);
  const {client} = useActivityPubRestClientContext()

  function getHomeTimeline() {
    if (!client) {
      throw new Error("_client not initialized");
    }
    return client.getHomeTimeline();
  }

  // Queries
  const {status, data, fetchStatus, refetch} = useQuery<
      mastodon.v1.Status[] | Note[]
  >({
    queryKey: ["mastodon/timelines/home"],
    queryFn: getHomeTimeline,
    enabled: client !== null
  });

  async function getCustomEmojisForInstance(subdomain: string) {
    return await axios.get(
        `${accountState.activeAccount.subdomain}/api/emojis`
    );
  }

  /**
   * Update the emoji raw cache everyday
   * @param subdomain
   * @returns
   */
  async function updateEmojiCache(subdomain: string) {
    try {
      const emojisUpdatedAt = await CacheRepo.getUpdatedAt(
          `${subdomain}/api/emojis`
      );

      if (emojisUpdatedAt.length > 0) {
        let lastUpdatedAt = new Date(emojisUpdatedAt[0].updated_at);
        lastUpdatedAt.setDate(lastUpdatedAt.getDate() + 1);

        const delta = lastUpdatedAt.getTime() < new Date().getTime();
        if (!delta) {
          console.log(`[INFO]: emoji cache is up to date for ${subdomain}`);
          return;
        }
        const res = await getCustomEmojisForInstance(subdomain);
        const payload = JSON.stringify(res.data);
        CacheRepo.set(`${subdomain}/api/emojis`, payload);
        console.log(`[INFO]: emojis updated for ${subdomain}`);
      }
    } catch (e) {
      const res = await getCustomEmojisForInstance(subdomain);
      const payload = JSON.stringify(res.data);
      CacheRepo.set(`${subdomain}/api/emojis`, payload);
      console.log(`[INFO]: emojis updated for ${subdomain}`);
    }
  }

  /**
   * Load global emoji database
   */
  useEffect(() => {
    if (accountState.activeAccount?.domain) {
      const url = accountState.activeAccount.subdomain;
      updateEmojiCache(url);
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
      console.log("[INFO] : loaded timeline...")
      setRefreshing(false);
    }
  }, [status, fetchStatus]);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    console.log("[INFO] : refreshing timeline...")
    setRefreshing(true);
    refetch();

    const subdomain = accountState.activeAccount?.domain;
    if (subdomain) {
      updateEmojiCache(subdomain);
    }
  }, []);

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
            onScroll={handleScroll}
            ref={ref}
            contentInset={{
              top: SHOWN_SECTION_HEIGHT + HIDDEN_SECTION_HEIGHT + 1000,
            }}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
            }
        >
          <Text style={{color: "white"}}>
            Showing 0-{data?.length || 0} results
          </Text>
          {data && data.map((o: mastodon.v1.Status | Note, i) =>
              <WithActivitypubStatusContext status={o} key={i}>
                <StatusFragment key={i}/>
              </WithActivitypubStatusContext>
          )}
        </Animated.ScrollView>
      </SafeAreaView>
  );
}

export default TimelineRenderer;

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
