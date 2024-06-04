import {useEffect, useState} from "react";
import LoadingMore from "../screens/home/LoadingMore";
import {FetchStatus} from "@tanstack/react-query";

type AnimatedScrollViewWithLoadingIndicatorProps = {
  children: any,
  fetchStatus: FetchStatus
  hasNonZeroItems: boolean
}

/**
 * Adds a loading indicator at the bottom of an Animated Scroll view
 *
 * ^ Used across many accounts in this app
 */
function WithInfiniteScrollIndicator(props: AnimatedScrollViewWithLoadingIndicatorProps) {
  const [LoadingState, setLoadingState] = useState({
    visible: false,
    loading: false
  });

  useEffect(() => {
    switch (props.fetchStatus) {
      case "fetching": {
        if (!props.hasNonZeroItems) break
        setLoadingState({
          visible: true,
          loading: true
        })
        break
      }
      default: {
        setLoadingState({
          visible: false,
          loading: false
        })
        break
      }
    }
  }, [props.fetchStatus]);

  return <>
    {props.children}
    <LoadingMore
        visible={LoadingState.visible}
        loading={LoadingState.loading}
    />
  </>
}

export default WithInfiniteScrollIndicator