import Animated, {
  useAnimatedRef, useDerivedValue,
  useScrollViewOffset
} from "react-native-reanimated";
import WithActivitypubStatusContext from "../../../states/useStatus";
import StatusFragment
  from "../../../screens/timelines/fragments/StatusFragment";
import LoadingMore from "../home/LoadingMore";
import React, {useEffect} from "react";
import {Text} from "@rneui/themed"

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
  const offset = useScrollViewOffset(animatedRef);
  const text = useDerivedValue(
      () => `Scroll offset: ${offset.value.toFixed(1)}`
  );

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
    <Text>{text.value}</Text>
    {PageData && PageData.map((o, i) =>
        <WithActivitypubStatusContext status={o} key={i}>
          <StatusFragment/>
        </WithActivitypubStatusContext>
    )}
    <LoadingMore visible={LoadingMoreComponentProps.visible}
                 loading={LoadingMoreComponentProps.loading}
    />
  </Animated.ScrollView>
}

export default SearchResultsOnSuccess