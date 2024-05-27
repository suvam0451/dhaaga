import FollowedPosts from "./fragments/favourites/FollowedPosts";
import React, {useEffect} from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
import TitleOnlyStackHeaderContainer
  from "../../../containers/TitleOnlyStackHeaderContainer";
import WithAppPaginationContext, {
  useAppPaginationContext
} from "../../../../states/usePagination";
import {
  useActivityPubRestClientContext
} from "../../../../states/useActivityPubRestClient";
import {useQuery} from "@tanstack/react-query";
import {
  StatusArray
} from "@dhaaga/shared-abstraction-activitypub/src/adapters/status/_interface";
import WithScrollOnRevealContext, {
  useScrollOnReveal
} from "../../../../states/useScrollOnReveal";

function Content() {
  return <FollowedPosts/>
}

function ApiWrapper() {
  const {client} = useActivityPubRestClientContext()
  const navigation = useNavigation()
  const route = useRoute<any>()
  const {
    data: PageData,
    updateQueryCache,
    queryCacheMaxId,
    append,
    setMaxId
  } = useAppPaginationContext()
  const {resetEndOfPageFlag} = useScrollOnReveal()

  async function api() {
    if (!client) throw new Error("_client not initialized");
    return await client.getFavourites({
      limit: 5
    })
  }

  // Queries
  const {data, status, fetchStatus, refetch} = useQuery<
      StatusArray
  >({
    queryKey: ["favourites", queryCacheMaxId],
    queryFn: api,
    enabled: client !== null
  });

  useEffect(() => {
    if (status !== "success" || !data) return
    if (data.length > 0) {
      append(data, (o) => o.name)
      setMaxId((PageData.length + data.length).toString())
      resetEndOfPageFlag()
    }
  }, [fetchStatus]);

  function onScrollEndReach() {
    if (PageData.length > 0) {
      updateQueryCache()
      refetch()
    }
  }

  return <TitleOnlyStackHeaderContainer
      route={route} navigation={navigation}
      headerTitle={`My Favourites`}
      onScrollViewEndReachedCallback={onScrollEndReach}
  >
    <Content/>
  </TitleOnlyStackHeaderContainer>
}

function Wrapper() {
  return <WithScrollOnRevealContext
      maxDisplacement={150}>
    <WithAppPaginationContext>
      <ApiWrapper/>
    </WithAppPaginationContext>
  </WithScrollOnRevealContext>
}

function FavouritesStackScreen() {
  return <Wrapper/>
}

export default FavouritesStackScreen