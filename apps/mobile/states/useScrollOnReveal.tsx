import {createContext, useContext, useState} from "react";
import {
  Easing, runOnJS,
  ScrollHandlerProcessed, SharedValue,
  useAnimatedScrollHandler, useAnimatedStyle,
  useSharedValue, withTiming
} from "react-native-reanimated";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  ViewStyle
} from "react-native";

type Type = {
  translateY: SharedValue<number>
  isScrolling: boolean
  isRefreshComponentVisible: boolean
  isEndOfPage: boolean
  scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>
  outputStyle: StyleProp<ViewStyle>
  resetOffset: () => void
  resetEndOfPageFlag: () => void
}

const defaultValue: Type = {
  outputStyle: undefined,
  isScrolling: false,
  isEndOfPage: false,
  isRefreshComponentVisible: false,
  translateY: undefined,
  scrollHandler(event: NativeSyntheticEvent<NativeScrollEvent>,
      context: Record<string, unknown> | undefined): void {
  },
  resetOffset(): void {
  },
  resetEndOfPageFlag(): void {

  }
}

const ScrollOnRevealContext = createContext<Type>(defaultValue);

export function useScrollOnReveal() {
  return useContext(ScrollOnRevealContext);
}

type PropsType = {
  maxDisplacement?: number
  children: any
}


function WithScrollOnRevealContext({
  maxDisplacement = 100,
  children
}: PropsType) {
  // const [IsRefreshVisible, setIsRefreshVisible] = useState(false)
  /**
   * Scroll Handler to show/hide menu
   * @param e
   */
  const translateY = useSharedValue(0);
  const totalPageOffsetY = useSharedValue(0);
  const lastContentOffset = useSharedValue(0);
  const isScrolling = useSharedValue(false);
  const isRefreshVisible = useSharedValue(false);

  const [IsEndOfPage, setIsEndOfPage] = useState(false)

  const hideStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(translateY.value, {
            duration: 250,
            easing: Easing.inOut(Easing.ease),
          }),
        },
      ],
    };
  });

  function resetEndOfPageFlag() {
    setIsEndOfPage(false)
  }


  function resetOffset() {
    translateY.value = 0;
  }

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      totalPageOffsetY.value = event.contentOffset.y
      isRefreshVisible.value = event.contentOffset.y <= 100;

      if (
          lastContentOffset.value > event.contentOffset.y + 16 &&
          isScrolling.value
      ) {
        translateY.value = 0;
      } else if (
          lastContentOffset.value + 12 < event.contentOffset.y &&
          isScrolling.value
      ) {
        translateY.value = maxDisplacement;
      }
      lastContentOffset.value = event.contentOffset.y;

      const {layoutMeasurement, contentOffset, contentSize} = event
      const paddingToBottom = 60;
      if (layoutMeasurement.height + contentOffset.y >=
          contentSize.height - paddingToBottom) {
        runOnJS(setIsEndOfPage)(true);
      }
    },
    onMomentumBegin: (e) => {
      isScrolling.value = true;
    },
    onMomentumEnd: (e) => {
      if (e.contentOffset.y < 50) {
        translateY.value = 0
      }
      isScrolling.value = false;
    },
  });

  return <ScrollOnRevealContext.Provider value={{
    scrollHandler,
    isScrolling: isScrolling.value,
    isRefreshComponentVisible: isRefreshVisible.value,
    translateY,
    outputStyle: hideStyle,
    resetOffset,
    resetEndOfPageFlag,
    isEndOfPage: IsEndOfPage
  }}>
    {children}
  </ScrollOnRevealContext.Provider>
}

export default WithScrollOnRevealContext