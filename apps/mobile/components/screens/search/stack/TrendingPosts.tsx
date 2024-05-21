import {View} from "react-native";
import {
  useActivityPubRestClientContext
} from "../../../../states/useActivityPubRestClient";
import {useQuery} from "@tanstack/react-query";
import React, {useEffect} from "react";
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
import StatusFragment
  from "../../../common/status/StatusFragment";
import {useNavigation, useRoute} from "@react-navigation/native";
import WithInfiniteScrollIndicator
  from "../../../containers/WithInfiniteScrollIndicator";


function Content() {
  const {data: PageData} = useAppPaginationContext()

  if (!PageData) return <View></View>
  return <>
    {PageData.map((o: mastodon.v1.Status | Note, i) =>
        <WithActivitypubStatusContext status={o} key={i}>
          <StatusFragment key={i}/>
        </WithActivitypubStatusContext>)}
  </>
}

/**
 * Search Module -- Trending Posts
 */
function ApiWrapper() {
  const {client} = useActivityPubRestClientContext()
  const {
    data: PageData,
    setMaxId,
    append,
    maxId
  } = useAppPaginationContext()
  const {resetEndOfPageFlag} = useScrollOnReveal()

  const api = () => client ? client.getTrendingPosts({
    limit: 5,
    offset: parseInt(maxId)
  }) : null

  // Queries
  const {status, data, fetchStatus, refetch} = useQuery({
    queryKey: ["trending/posts", maxId],
    queryFn: api,
    enabled: client !== null,
  });

  function onScrollEndReach() {

    if (PageData.length > 0) {
      // @ts-ignore-next-line
      refetch()

    }
  }

  useEffect(() => {
    if (status !== "success" || !data) return
    if (data.length > 0) {
      append(data)
      setMaxId(PageData.length.toString())
      resetEndOfPageFlag()
    }
  }, [fetchStatus, status]);

  const navigation = useNavigation()
  const route = useRoute()

  return <TitleOnlyStackHeaderContainer
      route={route}
      navigation={navigation}
      headerTitle={"Trending Posts"}
      onScrollViewEndReachedCallback={onScrollEndReach}
  >
    <WithInfiniteScrollIndicator
        fetchStatus={fetchStatus}
        hasNonZeroItems={PageData.length > 0}
    >
      <Content/>
    </WithInfiniteScrollIndicator>
  </TitleOnlyStackHeaderContainer>
}

function TrendingPostsContainer() {
  return <WithScrollOnRevealContext maxDisplacement={150}>
    <WithAppPaginationContext>
      <ApiWrapper/>
    </WithAppPaginationContext>
  </WithScrollOnRevealContext>
}

export default TrendingPostsContainer