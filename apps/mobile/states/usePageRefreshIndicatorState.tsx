import {
  FetchStatus,
  QueryObserverResult,
  RefetchOptions
} from "@tanstack/react-query";
import {useEffect, useMemo, useState} from "react";

type Props = {
  fetchStatus: FetchStatus
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>
}

function usePageRefreshIndicatorState({fetchStatus, refetch}: Props) {
  const [IsRefresh, setIsRefresh] = useState(false)
  const [Refreshing, setRefreshing] = useState(false)

  function onRefresh() {
    setRefreshing(true)
    setIsRefresh(true)
    refetch()
  }

  useEffect(() => {
    if (IsRefresh && fetchStatus !== "fetching") {
      setRefreshing(false)
      setIsRefresh(false)
    }
  }, [fetchStatus]);

  return {onRefresh, refreshing: Refreshing && IsRefresh}
}

export default usePageRefreshIndicatorState