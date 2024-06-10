import React, {useState} from "react";
import {
  StyleSheet,
  useWindowDimensions,
  View
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Dialog, Text} from "@rneui/themed"
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {APP_FONT, APP_THEME} from "../styles/AppTheme";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import {TabView, SceneMap} from 'react-native-tab-view';
import {DialogButtonGroupItem} from "../styles/Containers";
import DefaultPinnedItem from "./screens/home/timeline-menu/DefaultPinnedItem";

const ICON_SIZE = 20


const FirstRoute = () => {
  return <View>
    <View style={{display: "flex", marginTop: 32}}>
      <DefaultPinnedItem
          label={"Home"}
          Icon={<FontAwesome5
              name="home" size={ICON_SIZE}
              color={APP_FONT.MONTSERRAT_HEADER}/>}
      />
      <DefaultPinnedItem
          label={"Local"}
          Icon={<FontAwesome5
              name="user-friends" size={ICON_SIZE}
              color={APP_FONT.MONTSERRAT_HEADER}/>}
      />
      <DefaultPinnedItem
          label={"Federated"}
          Icon={<FontAwesome6
              name="globe" size={ICON_SIZE}
              color={APP_FONT.MONTSERRAT_HEADER}/>}
      />
      <DefaultPinnedItem
          label={"Private Mode"}
          Icon={<FontAwesome6
              name="redhat" size={ICON_SIZE}
              color={APP_FONT.MONTSERRAT_HEADER}/>}
      />
    </View>

    <View style={{marginTop: 32}}></View>
    <View style={{
      borderRadius: 8, backgroundColor: "#444", padding: 4,
      paddingRight: 0,
      display: "flex", flexDirection: "row",
      alignItems: "center",
      width: "100%"
    }}>
      <View style={{width: 32}}>
        <MaterialCommunityIcons
            name="antenna" size={24}
            color={APP_FONT.MONTSERRAT_HEADER}/>
      </View>
      <View style={{flexGrow: 1, flex: 1}}>
        <Text style={{fontFamily: "Inter-Regular"}}>Add Remote Timeline</Text>
      </View>
      <View style={{flexShrink: 1, minWidth: 24}}>
        <FontAwesome5
            name="chevron-right" size={18}
            color={APP_FONT.MONTSERRAT_HEADER}/>
      </View>
    </View>

    <View style={{
      borderRadius: 8, backgroundColor: "#444", padding: 4,
      display: "flex", flexDirection: "row",
      alignItems: "center",
      width: "100%"
    }}>
      <View style={{width: 32}}>
        <MaterialIcons name="dashboard-customize" size={24}
                       color={APP_FONT.MONTSERRAT_HEADER}/>
      </View>
      <Text>Add Custom Timeline</Text>
    </View>
  </View>
}

const SecondRoute = () => (
    <View style={{flex: 1, backgroundColor: '#673ab7'}}/>
);

const renderScene = SceneMap({
  pinned: FirstRoute,
  lists: SecondRoute,
  tags: FirstRoute,
  users: FirstRoute,
  custom: FirstRoute
});

type HeadersProps = {
  HIDDEN_SECTION_HEIGHT: number;
  SHOWN_SECTION_HEIGHT: number;
};
const TimelinesHeader = ({
  HIDDEN_SECTION_HEIGHT,
  SHOWN_SECTION_HEIGHT,
}: HeadersProps) => {
  const [ShowTimelineSelection, setShowTimelineSelection] = useState(false)

  function onIconPress() {
    setShowTimelineSelection(true)
  }

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'pinned', title: 'Pinned'},
    {key: 'lists', title: 'Lists'},
    {key: 'tags', title: 'Tags'},
    {key: 'users', title: 'Users'},
    {key: 'custom', title: 'Custom'},
  ]);
  const layout = useWindowDimensions();


  const renderTabBar = (props: any) => {
    const routes: {
      key: string,
      title: string
    }[] = props.navigationState.routes
    return <View style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      backgroundColor: "#555",
      borderRadius: 8,
      paddingHorizontal: 8
    }}>
      {routes.map((o, i) => {
        switch (i) {
          case 0:
            return <DialogButtonGroupItem key={i}>
              <View style={{width: 24}}>
                <AntDesign
                    name="pushpin" size={24}
                    color={index === 0 ?
                        APP_THEME.LINK : "#888"}/>
              </View>
            </DialogButtonGroupItem>
          case 1:
            return <DialogButtonGroupItem key={i} style={{flex: 1}}>
              <View style={{width: 24}}>
                <FontAwesome5
                    name="list" size={24} color={
                  index === 1 ?
                      APP_THEME.LINK : "#888"}/>
              </View>
            </DialogButtonGroupItem>

          case 2:
            return <DialogButtonGroupItem key={i}>
              <View style={{width: 24}}>
                <FontAwesome6
                    name="hashtag" size={24} color={index === 2 ?
                    APP_THEME.LINK : "#888"}/>
              </View>
            </DialogButtonGroupItem>

          case 3:
            return <DialogButtonGroupItem key={i}>
              <View style={{width: 24}}>
                <FontAwesome5
                    name="user-alt" size={24} color={index === 3 ?
                    APP_THEME.LINK : "#888"}/>
              </View>
            </DialogButtonGroupItem>
          case 4:
            return <DialogButtonGroupItem key={i}>
              <View style={{width: 24}}>
                <MaterialIcons
                    name="dashboard-customize" size={24}
                    color={index === 4 ?
                        APP_THEME.LINK : "#888"}/>
              </View>
            </DialogButtonGroupItem>
        }
      })}
    </View>
  };

  return (
      <View
          style={[
            styles.subHeader,
            {
              height: HIDDEN_SECTION_HEIGHT,
            },
          ]}
      >
        <Ionicons name="menu" size={24} color="white" style={{opacity: 0.6}}/>
        <View style={{
          display: "flex", flexDirection: "row",
          alignItems: "center",
        }}>
          <Text style={[styles.conversation, {opacity: 0.6}]}>Home</Text>
          <Ionicons
              onPress={onIconPress}
              name="chevron-down" color={"white"} size={20}
              style={{opacity: 0.6, marginLeft: 4, marginTop: 2}}
          />
        </View>

        <Ionicons name="settings-outline" size={24} color="white"
                  style={{opacity: 0.6}}/>

        <Dialog overlayStyle={{backgroundColor: "#2c2c2c", height: 400}}
                isVisible={ShowTimelineSelection}
                onBackdropPress={() => {
                  setShowTimelineSelection(false)
                }}>
          <TabView
              navigationState={{index, routes}}
              renderScene={renderScene}
              onIndexChange={setIndex}
              renderTabBar={renderTabBar}
              initialLayout={{width: layout.width, height: 400}}
          />
        </Dialog>
      </View>
  );
};

const styles = StyleSheet.create({
  subHeader: {
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor: APP_THEME.DARK_THEME_MENUBAR,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  conversation: {color: "white", fontSize: 16, fontWeight: "bold"},
  searchText: {
    color: "#8B8B8B",
    fontSize: 17,
    lineHeight: 22,
    marginLeft: 8,
  },
  searchBox: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#0F0F0F",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
export default TimelinesHeader;
