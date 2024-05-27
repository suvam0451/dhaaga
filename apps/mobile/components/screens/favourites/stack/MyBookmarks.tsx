import {useQuery} from "@tanstack/react-query";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {Note} from "@dhaaga/shared-provider-misskey/src";
import {
  useActivityPubRestClientContext
} from "../../../../states/useActivityPubRestClient";
import {useCallback, useEffect, useState} from "react";
import StatusItem
  from "../../../common/status/StatusItem";
import WithActivitypubStatusContext from "../../../../states/useStatus";
import TitleOnlyStackHeaderContainer
  from "../../../containers/TitleOnlyStackHeaderContainer";
import {useNavigation, useRoute} from "@react-navigation/native";
import {useAppPaginationContext} from "../../../../states/usePagination";
import {useScrollOnReveal} from "../../../../states/useScrollOnReveal";

function MyBookmarks() {
  const {client} = useActivityPubRestClientContext()
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation()
  const route = useRoute<any>()
  const {
    data: PageData,
    updateQueryCache,
  } = useAppPaginationContext()

  async function api() {
    if (!client) {
      return []
    }
    return await client.getBookmarks({
      limit: 5,
    })
  }


  function onScrollEndReach() {
    if (PageData.length > 0) {
      updateQueryCache()
      refetch()
    }
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

  return <TitleOnlyStackHeaderContainer
      route={route} navigation={navigation}
      headerTitle={`My Favourites`}
      onScrollViewEndReachedCallback={onScrollEndReach}
  >
    {data && data.map((o, i) =>
        <WithActivitypubStatusContext status={o} key={i}>
          <StatusItem/>
        </WithActivitypubStatusContext>
    )}
  </TitleOnlyStackHeaderContainer>
}

export default MyBookmarks;