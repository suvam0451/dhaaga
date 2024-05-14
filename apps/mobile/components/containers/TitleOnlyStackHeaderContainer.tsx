import React, {useRef} from "react";
import {Animated, StyleSheet, View} from "react-native";
import diffClamp = Animated.diffClamp;
import ProfilePageHeader from "../headers/ProfilePageHeader";

type TitleOnlyStackHeaderContainerProps = {
  route: any,
  navigation: any,
  HIDDEN_SECTION_HEIGHT?: number
  SHOWN_SECTION_HEIGHT?: number
  headerTitle: string
  children?: any
}

function TitleOnlyStackHeaderContainer(
    {
      headerTitle,
      route, navigation,
      HIDDEN_SECTION_HEIGHT = 50,
      SHOWN_SECTION_HEIGHT = 50,
      children
    }: TitleOnlyStackHeaderContainerProps) {
  /**
   * Header bar auto-hide handler
   */
  const scrollY = useRef(new Animated.Value(0));
  const scrollYClamped = diffClamp(
      scrollY.current,
      0,
      HIDDEN_SECTION_HEIGHT + SHOWN_SECTION_HEIGHT
  );

  const translateY = scrollYClamped.interpolate({
    inputRange: [0, HIDDEN_SECTION_HEIGHT + SHOWN_SECTION_HEIGHT],
    outputRange: [0, -HIDDEN_SECTION_HEIGHT],
  });

  const translateYNumber = useRef();

  translateY.addListener(({value}) => {
    translateYNumber.current = value;
  });

  const handleScroll = Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {y: scrollY.current},
          },
        },
      ],
      {
        useNativeDriver: true,
      }
  );

  return <View style={{height: "100%"}}>
    <Animated.View style={[styles.header, {transform: [{translateY}]}]}>
      <ProfilePageHeader
          title={headerTitle}
          SHOWN_SECTION_HEIGHT={SHOWN_SECTION_HEIGHT}
          HIDDEN_SECTION_HEIGHT={HIDDEN_SECTION_HEIGHT}
          onLeftIconPress={() =>
              navigation.goBack()
          }
      />
    </Animated.View>
    <Animated.ScrollView
        style={{
          backgroundColor: "black",
          paddingTop: SHOWN_SECTION_HEIGHT,
        }}
        contentContainerStyle={{
          display: "flex",
          minHeight: "100%",
          paddingBottom: SHOWN_SECTION_HEIGHT,
        }}
        onScroll={handleScroll}
    >{children}</Animated.ScrollView>
  </View>
}

export default TitleOnlyStackHeaderContainer;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    backgroundColor: "#1c1c1c",
    left: 0,
    right: 0,
    width: "100%",
    zIndex: 1,
  },
})