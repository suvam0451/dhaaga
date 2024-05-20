import {useQuery} from "@tanstack/react-query";
import {
  useActivityPubRestClientContext
} from "../../../states/useActivityPubRestClient";
import {RefreshControl} from 'react-native-gesture-handler'
import React, {useCallback, useEffect, useState} from "react";
import Animated from "react-native-reanimated";
import StatusFragment
  from "../../../screens/timelines/fragments/StatusFragment";
import WithActivitypubStatusContext from "../../../states/useStatus";
import {useScrollOnReveal} from "../../../states/useScrollOnReveal";

type SearchResultsProps = {
  q: string,
  type: "accounts" | "hashtags" | "statuses" | null | undefined
}

function SearchResults(props: SearchResultsProps) {
  const {client} = useActivityPubRestClientContext()
  const {scrollHandler, resetOffset} = useScrollOnReveal()

  const [refreshing, setRefreshing] = useState(false);

  async function api(): Promise<{
    accounts: any[]
    hashtags: any[]
    statuses: any[]
  }> {
    if (!client) {
      console.log("[ERROR]: no client")
      return {
        accounts: [],
        hashtags: [],
        statuses: []
      }
    }
    if (!props.q) return null
    return await client.search(props.q, {following: false, type: null})
  }

  // Queries
  const {status, data, refetch} = useQuery({
    queryKey: ["search", props.q, props.type],
    queryFn: api,
    enabled: client !== null
  });

  useEffect(() => {
    if (status !== "success") return
    console.log(data)
  }, [status]);

  useEffect(() => {
    if (status === "success") {
      setRefreshing(false)
      resetOffset()
    }
  }, [status, data, refreshing]);

  const onRefresh = useCallback(() => {
    refetch();
    setRefreshing(true)
  }, []);

  return <Animated.ScrollView
      refreshControl={<RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}/>
      }
      onScroll={scrollHandler}
      scrollEventThrottle={2}
  >
    {data && data.statuses && data.statuses.map((o, i) =>
        <WithActivitypubStatusContext status={o} key={i}>
          <StatusFragment/>
        </WithActivitypubStatusContext>
    )}
  </Animated.ScrollView>
}

export default SearchResults;