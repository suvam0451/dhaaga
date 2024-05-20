import {Text} from "react-native";
import WithActivityPubRestClient from "../states/useActivityPubRestClient";
import {Button, Tab, TabView} from "@rneui/themed";
import FollowedPosts from "../components/screens/favourites/FollowedPosts";
import {Ionicons} from "@expo/vector-icons";
import React, {useState} from "react";
import BookmarkedPosts from "../components/screens/favourites/BookmarkedPosts";
import Animated from "react-native-reanimated";
import WithScrollOnRevealContext, {
  useScrollOnReveal
} from "../states/useScrollOnReveal";
import appStyling from "../styles/AppStyles";

const ICON_SIZE = 22;

function FavouritesScreenTabSetup() {
  const [TabValue, setTabValue] = useState(0)
  const {outputStyle} = useScrollOnReveal()

  function onTabChanged(e: any) {
    setTabValue(e)
  }

  return <>
    <TabView
        disableSwipe={true}
        value={TabValue}
        onChange={onTabChanged}
        animationType="spring"
        containerStyle={{
          backgroundColor: "#121212",
        }}
        tabItemContainerStyle={{
          width: '100%',
          backgroundColor: '#121212'
        }}
    >
      <TabView.Item>
        <FollowedPosts/>
      </TabView.Item>
      <TabView.Item>
        <BookmarkedPosts/>
      </TabView.Item>
      <TabView.Item>
        <Text>Cart</Text>
      </TabView.Item>
    </TabView>
    <Animated.View style={[appStyling.inputAssistant, outputStyle]}>
      <Tab value={TabValue} onChange={onTabChanged}
          // scrollable
           indicatorStyle={{
             backgroundColor: 'white',
             height: 2,
           }}
           containerStyle={{
             backgroundColor: "#2E2E2E",
           }}
           style={{
             marginHorizontal: 4,
             marginBottom: 4,
           }}
           variant="primary"
      >
        <Tab.Item>
          <Ionicons
              color={"#888"}
              name={"star-outline"}
              size={ICON_SIZE}/>
        </Tab.Item>
        <Tab.Item>
          <Ionicons
              color={"#888"}
              name={"bookmark-outline"}
              size={ICON_SIZE}/>
        </Tab.Item>
        <Tab.Item>
          <Ionicons color={"#888"} name={"star-outline"} size={ICON_SIZE}/>
        </Tab.Item>
        <Tab.Item>
          <Ionicons color={"#888"} name={"star-outline"} size={ICON_SIZE}/>
        </Tab.Item>
        <Button color={"#ff38fe"}>Top</Button>
      </Tab>
    </Animated.View>
  </>
}

function FavouritesScreen() {
  return (
      <WithActivityPubRestClient>
        <WithScrollOnRevealContext>
          <FavouritesScreenTabSetup/>
        </WithScrollOnRevealContext>
      </WithActivityPubRestClient>
  );
}

export default FavouritesScreen;
