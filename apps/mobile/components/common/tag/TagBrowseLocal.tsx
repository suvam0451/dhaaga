import {useQuery} from "@tanstack/react-query";
import React, {useCallback, useEffect, useState} from "react";
import StatusItem from "../status/StatusItem";
import {Skeleton} from "@rneui/base";
import {
  ActivityPubStatuses,
} from "@dhaaga/shared-abstraction-activitypub/src";
import TitleOnlyStackHeaderContainer
  from "../../containers/TitleOnlyStackHeaderContainer";
import WithActivitypubStatusContext from "../../../states/useStatus";
import {
  useActivityPubRestClientContext
} from "../../../states/useActivityPubRestClient";
import {useNavigation, useRoute} from "@react-navigation/native";
import WithAppPaginationContext, {
  useAppPaginationContext
} from "../../../states/usePagination";
import WithScrollOnRevealContext, {
  useScrollOnReveal
} from "../../../states/useScrollOnReveal";
import WithInfiniteScrollIndicator
  from "../../containers/WithInfiniteScrollIndicator";
import {View} from "react-native";


function Content() {
  const {data: PageData} = useAppPaginationContext()
  if (!PageData) return <View></View>


  return <>
    {PageData.map((o, i) => (
        <WithActivitypubStatusContext status={o} key={i}>
          <StatusItem key={i}/>
        </WithActivitypubStatusContext>
    ))}
  </>
}

function ApiWrapper() {
  const navigation = useNavigation()
  const route = useRoute<any>()
  const q = route?.params?.q;
  const {client} = useActivityPubRestClientContext()
  const {
    data: PageData,
    queryCacheMaxId,
    updateQueryCache,
    append,
    setMaxId
  } = useAppPaginationContext()
  const {resetEndOfPageFlag} = useScrollOnReveal()

  const [refreshing, setRefreshing] = useState(false);

  function api() {
    if (!client) throw new Error("_client not initialized");
    return client.getTimelineByHashtag(q, {maxId: queryCacheMaxId});
  }

  // Queries
  const {status, data, error, fetchStatus, refetch} =
      useQuery<ActivityPubStatuses>({
        queryKey: ["local/tag", q],
        queryFn: api,
        enabled: client && q !== undefined,
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
      append(data)
      setMaxId(data[data.length - 1]?.id)
      resetEndOfPageFlag()
    }
    setRefreshing(false);
  }, [status, fetchStatus]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch();
  }, []);

  if (!data) return <Skeleton/>
  return <TitleOnlyStackHeaderContainer
      route={route} navigation={navigation}
      headerTitle={`#${q}`}
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

function TagBrowseLocal() {
  return <WithScrollOnRevealContext maxDisplacement={150}>
    <WithAppPaginationContext>
      <ApiWrapper/>
    </WithAppPaginationContext>
  </WithScrollOnRevealContext>
}

export default TagBrowseLocal;
