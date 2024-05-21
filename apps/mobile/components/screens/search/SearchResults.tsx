import {useQuery} from "@tanstack/react-query";
import {
  useActivityPubRestClientContext
} from "../../../states/useActivityPubRestClient";
import React, {useCallback, useEffect, useState} from "react";
import {useScrollOnReveal} from "../../../states/useScrollOnReveal";
import {
  NativeScrollEvent,
  NativeSyntheticEvent
} from "react-native";
import NoResults from "../../error-screen/NoResults";
import SearchScreenManual from "../../error-screen/SearchScreenManual";
import AppLoadingIndicator from "../../error-screen/AppLoadingIndicator";
import {useAppPaginationContext} from "../../../states/usePagination";
import SearchResultsOnSuccess from "./SearchResultsOnSuccess";

type SearchResultsProps = {
  q: string,
  type: "accounts" | "hashtags" | "statuses" | null | undefined
}

function SearchResults(props: SearchResultsProps) {
  const {client} = useActivityPubRestClientContext()
  const {resetOffset, resetEndOfPageFlag} = useScrollOnReveal()

  const {
    data: PageData,
    setMaxId,
    append,
    maxId,
    clear,
    paginationLock,
  } = useAppPaginationContext()

  const [refreshing, setRefreshing] = useState(false);
  const [LoadingMoreComponentProps, setLoadingMoreComponentProps] = useState({
    visible: false,
    loading: false
  });

  async function api(): Promise<{
    accounts: any[]
    hashtags: any[]
    statuses: any[]
  }> {
    if (!client) {
      return {
        accounts: [],
        hashtags: [],
        statuses: []
      }
    }
    if (!props.q) return null
    return await client.search(props.q, {
      following: false,
      type: null,
      limit: 5,
      maxId
    })
  }

  // Queries
  const {status, data, fetchStatus, refetch} = useQuery({
    queryKey: ["search", props.q, props.type],
    queryFn: api,
    enabled: client !== null && !paginationLock,
  });

  useEffect(() => {
    clear()
  }, [props.q]);

  useEffect(() => {
    if (fetchStatus === "fetching") {
      if (PageData.length > 0) {
        setLoadingMoreComponentProps({
          visible: true,
          loading: true
        })
      }
    }

    if (status !== "success" || !data) return
    if (status === "success" && !paginationLock && data.statuses.length > 0) {
      setMaxId(data.statuses[data.statuses.length - 1]?.id)
      append(data.statuses)
      resetEndOfPageFlag()
    }

    setLoadingMoreComponentProps({
      visible: false,
      loading: false
    })
  }, [fetchStatus, status, paginationLock]);

  function handlePagination(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const {layoutMeasurement, contentOffset, contentSize} = e.nativeEvent
    const paddingToBottom = 60;
    if (layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom) {
      refetch()
      setLoadingMoreComponentProps({
        visible: true,
        loading: true
      })
    }
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
  }

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

  if (!props.q || props.q === "") return <SearchScreenManual/>
  if (fetchStatus === "fetching" && PageData.length === 0) return <AppLoadingIndicator
      text={"Loading..."}
      searchTerm={props.q}/>

  if (status === "success" && data?.statuses?.length === 0)
    return <NoResults text={"No results 🤔"} subtext={"Try change categories" +
        " or" +
        " a different keyword"}/>

  return <SearchResultsOnSuccess
      PageData={PageData}
      refetch={refetch}
      LoadingMoreComponentProps={LoadingMoreComponentProps}
  />
}

export default SearchResults;