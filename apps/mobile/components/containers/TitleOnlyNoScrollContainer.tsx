import React from "react";
import {Animated, StyleSheet, View} from "react-native";
import ProfilePageHeader from "../headers/ProfilePageHeader";
import {APP_THEME} from "../../styles/AppTheme";
import {useNavigation, useRoute} from "@react-navigation/native";

type TitleOnlyStackHeaderContainerProps = {
  HIDDEN_SECTION_HEIGHT?: number
  SHOWN_SECTION_HEIGHT?: number
  headerTitle: string
  children: any
}

function TitleOnlyNoScrollContainer(
    {
      headerTitle,
      HIDDEN_SECTION_HEIGHT = 50,
      SHOWN_SECTION_HEIGHT = 50,
      children,
    }: TitleOnlyStackHeaderContainerProps) {
  const navigation = useNavigation<any>();
  const route = useRoute<any>()

  return <View style={{height: "100%", backgroundColor: APP_THEME.BACKGROUND}}>
    <Animated.View style={[styles.header]}>
      <ProfilePageHeader
          title={headerTitle}
          SHOWN_SECTION_HEIGHT={SHOWN_SECTION_HEIGHT}
          HIDDEN_SECTION_HEIGHT={HIDDEN_SECTION_HEIGHT}
          onLeftIconPress={() =>
              navigation.goBack()
          }
      />
    </Animated.View>
    {children}
  </View>
}

export default TitleOnlyNoScrollContainer;

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1c1c1c",
    left: 0,
    right: 0,
    width: "100%",
    zIndex: 1,
  },
})