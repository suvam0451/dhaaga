import ProfilePageHeader from "../headers/ProfilePageHeader";
import React from "react";
import {APP_THEME} from "../../styles/AppTheme";
import {Animated, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {TopNavBarStyles} from "../../styles/NavaigationItems";

// constants
const HIDDEN_SECTION_HEIGHT = 50
const SHOWN_SECTION_HEIGHT = 50


type AutoHideNavBarProps = {
  title: string
  children: any
  translateY?: Animated.AnimatedInterpolation<string | number>
}

/**
 * This container has a auto-hide Navbar.
 * The left side icon option is to always go back to previous page.
 * The right side icons may be customized
 * @param title
 * @param children
 * @param translateY
 * @constructor
 */
function WithAutoHideTopNavBar({
  title,
  children,
  translateY
}: AutoHideNavBarProps) {
  const navigation = useNavigation()
  return <Animated.View
      style={[{height: "100%", backgroundColor: APP_THEME.BACKGROUND,
      // paddingTop: translateY
      }]}>
    {translateY  !== undefined ?
        <Animated.View style={[
            TopNavBarStyles.navbar,
          {transform: [{translateY}]}]}>
          <ProfilePageHeader
              title={title}
              SHOWN_SECTION_HEIGHT={SHOWN_SECTION_HEIGHT}
              HIDDEN_SECTION_HEIGHT={HIDDEN_SECTION_HEIGHT}
              onLeftIconPress={() =>
                  navigation.goBack()
              }
          />
        </Animated.View> : <ProfilePageHeader
            title={title}
            SHOWN_SECTION_HEIGHT={SHOWN_SECTION_HEIGHT}
            HIDDEN_SECTION_HEIGHT={HIDDEN_SECTION_HEIGHT}
            onLeftIconPress={() =>
                navigation.goBack()
            }
        />}
    {children}
  </Animated.View>
}


export default WithAutoHideTopNavBar;