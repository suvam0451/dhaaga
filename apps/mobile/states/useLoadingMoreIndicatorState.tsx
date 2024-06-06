import {FetchStatus} from "@tanstack/react-query";
import {useMemo, useState} from "react";

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
  return useMemo(() => {
    if (fetchStatus === "fetching") {
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
  }, [fetchStatus])
}

export default useLoadingMoreIndicatorState;