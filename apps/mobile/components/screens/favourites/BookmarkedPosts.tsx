import {useQuery} from "@tanstack/react-query";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {Note} from "@dhaaga/shared-provider-misskey/src";
import {
  useActivityPubRestClientContext
} from "../../../states/useActivityPubRestClient";
import {RefreshControl} from "react-native";
import {useCallback, useEffect, useState} from "react";
import StatusFragment
  from "../../common/status/StatusFragment";
import WithActivitypubStatusContext from "../../../states/useStatus";
import {useScrollOnReveal} from "../../../states/useScrollOnReveal";
import Animated from "react-native-reanimated";

function BookmarkedPosts() {
  const {client} = useActivityPubRestClientContext()
  const [refreshing, setRefreshing] = useState(false);
  const {scrollHandler} = useScrollOnReveal()

  async function api() {
    if (!client) {
      return []
    }
    return await client.getBookmarks({
      limit: 5
    })
  }


  // Queries
  const {status, data, refetch} = useQuery<
      mastodon.v1.Status[] | Note[]
  >({
    queryKey: ["bookmarks"],
    queryFn: api,
    enabled: client !== null
  });

  useEffect(() => {
    if (status === "success") {
      setRefreshing(false)
    }
  }, [status, data, refreshing]);

  const onRefresh = useCallback(() => {
    refetch();
    setRefreshing(true)
  }, []);


  return <Animated.ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
      }
      onScroll={scrollHandler}
      scrollEventThrottle={2}
  >
    {data && data.map((o, i) =>
        <WithActivitypubStatusContext status={o} key={i}>
          <StatusFragment/>
        </WithActivitypubStatusContext>
    )}
  </Animated.ScrollView>
}

export default BookmarkedPosts;