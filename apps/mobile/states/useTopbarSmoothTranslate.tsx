import {Animated, NativeSyntheticEvent} from "react-native";
import {useRef} from "react";
import diffClamp = Animated.diffClamp;
import {getCloser} from "../utils";


type Props = {
  onScrollJsFn?: (event: NativeSyntheticEvent<unknown>) => void,
  totalHeight: number
  hiddenHeight: number
}

/**
 *
 * Uses Reanimated library to calculate the
 * current Y offset for the TopBar
 *
 * TODO: implement snap to closest on idle animation
 *
 * a.k.a. - Scroll on Reveal behavior
 * @param onScrollJsFn (optional) is function ran on the js thread
 * @param maxHeight is equal to hidden + alwaysShownHeight
 * @param hiddenHeight is height that will be hidden
 */
function useTopbarSmoothTranslate({
  onScrollJsFn,
  totalHeight,
  hiddenHeight
}: Props) {
  const scrollY = useRef(new Animated.Value(0));
  const scrollYClamped = diffClamp(
      scrollY.current,
      0,
      totalHeight
  );
  const translateY = scrollYClamped.interpolate({
    inputRange: [0, totalHeight],
    outputRange: [0, -hiddenHeight],
  });
  const translateYNumber = useRef();

  translateY.addListener(({value}) => {
    translateYNumber.current = value;
  });

  /**
   * When scroll view has stopped moving,
   * snap to the nearest section
   * @param param0
   */
  const ref = useRef(null);
  const handleSnap = ({nativeEvent}) => {
    const offsetY = nativeEvent.contentOffset.y;
    if (
        !(
            translateYNumber.current === 0 ||
            translateYNumber.current === -hiddenHeight
        )
    ) {
      if (ref.current) {
        try {
          /**
           * ScrollView --> scroll ???
           * FlatView --> scrollToOffset({offset: number}})
           */
          ref.current.scrollTo({
            // applies only for flat list
            offset:
                getCloser(translateYNumber.current, -hiddenHeight, 0) ===
                -hiddenHeight
                    ? offsetY + hiddenHeight
                    : offsetY - hiddenHeight,
          });
        } catch (e) {
          console.log("[WARN]: component is not a flat list");
        }
      }
    }
  };


  const onScroll = Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {y: scrollY.current},
          },
        },
      ],
      {
        useNativeDriver: true,
        listener: onScrollJsFn || undefined
      },
  );

  return {onScroll, translateY, ref}
}

export default useTopbarSmoothTranslate