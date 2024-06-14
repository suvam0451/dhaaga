import {
  FetchStatus,
  QueryObserverResult,
  RefetchOptions, useQueryClient
} from "@tanstack/react-query";
import {useEffect, useMemo, useState} from "react";

type Props = {
  fetchStatus: FetchStatus
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>
  queryKeys?: string[]
}

function usePageRefreshIndicatorState({
  fetchStatus,
  refetch,
  queryKeys
}: Props) {
  const [IsRefresh, setIsRefresh] = useState(false)
  const [Refreshing, setRefreshing] = useState(false)
  const queryClient = useQueryClient()

  async function onRefresh() {
    setRefreshing(true)
    setIsRefresh(true)

    await queryClient.invalidateQueries({
      queryKey: queryKeys || [],
      refetchType: 'all' // refetch both active and inactive queries
    })

    // queryClient
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