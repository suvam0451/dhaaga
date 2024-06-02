import {useQuery} from "@tanstack/react-query";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {Note} from "@dhaaga/shared-provider-misskey/src";
import {
  useActivityPubRestClientContext
} from "../../../../states/useActivityPubRestClient";
import React, {useCallback, useEffect, useState} from "react";
import StatusItem
  from "../../../common/status/StatusItem";
import WithActivitypubStatusContext from "../../../../states/useStatus";
import TitleOnlyStackHeaderContainer
  from "../../../containers/TitleOnlyStackHeaderContainer";
import {useNavigation, useRoute} from "@react-navigation/native";
import WithAppPaginationContext, {
  useAppPaginationContext
} from "../../../../states/usePagination";
import WithScrollOnRevealContext, {
  useScrollOnReveal
} from "../../../../states/useScrollOnReveal";
import LoadingMore from "../../home/LoadingMore";

function WithApi() {
  const {client} = useActivityPubRestClientContext()
  const [refreshing, setRefreshing] = useState(false);
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
  const [LoadingMoreComponentProps, setLoadingMoreComponentProps] = useState({
    visible: false,
    loading: false
  });

  async function api() {
    if (!client) throw new Error("_client not initialized");

    return await client.getBookmarks({
      limit: 5,
      maxId: queryCacheMaxId
    })
  }


  function onScrollEndReach() {
    if (PageData.length > 0) {
      updateQueryCache()
      refetch()
    }
  }


  // Queries
  const {status, data, refetch, fetchStatus} = useQuery<
      { data: mastodon.v1.Status[], minId?: string, maxId?: string }
  >({
    queryKey: ["bookmarks", queryCacheMaxId],
    queryFn: api,
    enabled: client !== null
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

    if (status !== "success" || !data) return
    if (data?.data?.length > 0) {
      const statuses = data.data
      append(statuses, (o) => o.id)
      setMaxId(data.maxId)
      resetEndOfPageFlag()
    }

    setLoadingMoreComponentProps({
      visible: false,
      loading: false
    })
  }, [fetchStatus]);

  const onRefresh = async () => {
    refetch();
    setRefreshing(true)
    setLoadingMoreComponentProps({
      visible: true,
      loading: true
    })
  }

  return <TitleOnlyStackHeaderContainer
      route={route} navigation={navigation}
      headerTitle={`My Bookmarks`}
      onScrollViewEndReachedCallback={onScrollEndReach}
      onRefresh={onRefresh}
  >
    {PageData && PageData.map((o, i) =>
        <WithActivitypubStatusContext status={o} key={i}>
          <StatusItem/>
        </WithActivitypubStatusContext>
    )}
    <LoadingMore
        visible={LoadingMoreComponentProps.visible}
        loading={LoadingMoreComponentProps.loading}
    />
  </TitleOnlyStackHeaderContainer>
}

function WithContext() {
  return <WithAppPaginationContext>
    <WithScrollOnRevealContext>
      <WithApi/>
    </WithScrollOnRevealContext>
  </WithAppPaginationContext>
}

function MyBookmarks() {
  return <WithContext/>
}

export default MyBookmarks;