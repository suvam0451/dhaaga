import {FetchStatus} from "@tanstack/react-query";
import {useMemo, useState} from "react";
import useSkeletonSmoothTransition from "./useSkeletonTransition";

type Props = {
  fetchStatus: FetchStatus
}

/**
 * Manages the state for the bottom indicator
 * that pops up for pages with infinite
 * scrolling support
 *
 * NOTE: only compatible with Tanstack useQuery
 */
function useLoadingMoreIndicatorState({fetchStatus}: Props) {
  /**
   * It just makes sure the loading indicator ticks
   * for a bit more, while the posts are being loaded
   * in the background for user.
   *
   * Fast scrolling, especially in longer lists will
   * cause app to lag
   */
  const overallLoading = fetchStatus === "fetching"
  const loading = useSkeletonSmoothTransition(overallLoading, {
    condition: fetchStatus === "idle",
    preventLoadingForCondition: false
  })

  return useMemo(() => {
    if (loading) {
      return {
        visible: true,
        loading: true
      }
    } else {
      return {
        visible: false,
        loading: false
      }
    }
  }, [loading])
}

export default useLoadingMoreIndicatorState;