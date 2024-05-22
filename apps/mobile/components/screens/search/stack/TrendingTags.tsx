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
import {useNavigation, useRoute} from "@react-navigation/native";
import WithInfiniteScrollIndicator
  from "../../../containers/WithInfiniteScrollIndicator";
import {TagType} from "@dhaaga/shared-abstraction-activitypub/src";
import WithActivitypubTagContext from "../../../../states/useTag";
import TagItem from "../../../common/tag/TagItem";


function Content() {
  const {data: PageData} = useAppPaginationContext()

  if (!PageData) return <View></View>
  return <View style={{display: "flex", backgroundColor: "#121212"}}>
    {PageData.map((o: TagType, i) =>
        <WithActivitypubTagContext tag={o} key={i}>
          <TagItem/>
        </WithActivitypubTagContext>)}
  </View>
}

/**
 * Search Module -- Trending Posts
 */
function ApiWrapper() {
  const {client} = useActivityPubRestClientContext()
  const {
    data: PageData,
    queryCacheMaxId,
    updateQueryCache,
    append,
    setMaxId
  } = useAppPaginationContext()
  const {resetEndOfPageFlag} = useScrollOnReveal()

  const api = () => client ? client.getTrendingTags({
    limit: 5,
    offset: parseInt(queryCacheMaxId)
  }) : null

  // Queries
  const {status, data, error, fetchStatus, refetch} = useQuery({
    queryKey: ["trending/tags", queryCacheMaxId],
    queryFn: api,
    enabled: client !== null,
  });

  function onScrollEndReach() {
    if (PageData.length > 0) {
      updateQueryCache()
      refetch()
    }
  }

  useEffect(() => {
    if (status !== "success" || !data) return
    if (data.length > 0) {
      append(data, (o) => o.name)
      setMaxId((PageData.length + data.length).toString())
      resetEndOfPageFlag()
    }
  }, [fetchStatus]);

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