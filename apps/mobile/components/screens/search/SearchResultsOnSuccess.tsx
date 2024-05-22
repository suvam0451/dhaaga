import Animated, {
  useAnimatedRef,
} from "react-native-reanimated";
import WithActivitypubStatusContext from "../../../states/useStatus";
import StatusItem
  from "../../common/status/StatusItem";
import LoadingMore from "../home/LoadingMore";
import React, {useEffect} from "react";

import {useScrollOnReveal} from "../../../states/useScrollOnReveal";
import {NativeScrollEvent, NativeSyntheticEvent} from "react-native";

type SearchResultsOnSuccess = {
  PageData: any[]
  refetch: any,
  LoadingMoreComponentProps: any
}

function SearchResultsOnSuccess({
  LoadingMoreComponentProps,
  refetch, PageData
}: SearchResultsOnSuccess) {
  const {scrollHandler, resetOffset, isEndOfPage, resetEndOfPageFlag} = useScrollOnReveal()
  const animatedRef = useAnimatedRef<Animated.ScrollView>();

  function handlePagination(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const {layoutMeasurement, contentOffset, contentSize} = e.nativeEvent
    const paddingToBottom = 60;
    if (layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom) {
      refetch()
    }
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
  }

  useEffect(() => {
    if(isEndOfPage && PageData.length> 0){
      console.log("trigger fetch")
    refetch()
    }
  }, [isEndOfPage]);

  return <Animated.ScrollView
      ref={animatedRef}
      // refreshControl={<RefreshControl
      //         refreshing={refreshing}
      //         onRefresh={onRefresh}/>
      // }
      onScroll={scrollHandler}
      scrollEventThrottle={2}
  >
    {PageData && PageData.map((o, i) =>
        <WithActivitypubStatusContext status={o} key={i}>
          <StatusItem/>
        </WithActivitypubStatusContext>
    )}
    <LoadingMore visible={LoadingMoreComponentProps.visible}
                 loading={LoadingMoreComponentProps.loading}
    />
  </Animated.ScrollView>
}

export default SearchResultsOnSuccess