import {Text, View} from "react-native";
import {Button} from "@rneui/themed";
import {Ionicons} from "@expo/vector-icons";
import React from "react";
import MyBookmarks from "../components/screens/favourites/stack/MyBookmarks";
import WithScrollOnRevealContext, {} from "../states/useScrollOnReveal";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {Divider} from "@rneui/base";
import {useNavigation, useRoute} from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import PostWithClientContext from "./shared/Post";
import MyFavourites from "../components/screens/favourites/stack/MyFavourites";
import FavouritesScreenHomePageDefaultTutorial
  from "../components/tutorials/screens/favourites/HomePage";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MyFollowings from "../components/screens/favourites/stack/MyFollowings";
import MyFollowers from "../components/screens/favourites/stack/MyFollowers";
import WithGorhomBottomSheetContext from "../states/useGorhomBottomSheet";

type FavouritesScreenNavigationItemIconOnlyProps = {
  icon: any
  onPress: () => void
  disabled?: boolean
}

type FavouritesScreenNavigationItemProps = {
  text: string
  icon: any
  onPress: () => void
  disabled?: boolean
}

function FavouritesScreenNavigationItemIconOnly({
  icon,
  disabled,
  onPress
}: FavouritesScreenNavigationItemIconOnlyProps) {
  return <View style={{flex: 1, paddingHorizontal: 4}}>
    <Button type={"clear"} buttonStyle={{
      borderWidth: 1,
      borderColor: "#333333",
      borderRadius: 8,
      padding: 4,
      backgroundColor: "#1E1E1E"
    }} onPress={onPress}>
      {icon}
    </Button>
  </View>
}

function FavouritesScreenNavigationItem({
  text,
  icon,
  onPress,
  disabled
}: FavouritesScreenNavigationItemProps) {
  return <View style={{flex: 1, paddingHorizontal: 4}}>
    <Button type={"clear"} buttonStyle={{
      borderWidth: 1,
      borderColor: "#333333",
      borderRadius: 8,
      padding: 8,
      backgroundColor: "#1E1E1E"
    }} onPress={onPress}>
      <Text
          style={{color: "#fff", opacity: disabled ? 0.3 : 0.6}}>{text}</Text>
      <View style={{marginLeft: 6}}>
        {icon}
      </View>
    </Button>
  </View>
}

function ActionableSection() {
  const navigation = useNavigation<any>()
  const route = useRoute()

  return <View>
    <View style={{
      borderWidth: 1,
      borderColor: "#ffffff30",
      borderRadius: 8,
      padding: 8,
      marginVertical: 8,
      marginHorizontal: 8
    }}>
      <View style={{
        marginHorizontal: 8,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
      }}>
        <Text style={{fontSize: 20, color: "#fff", opacity: 0.87}}>
          Saved by You
        </Text>
        <FontAwesome
            name="chevron-down" size={24} color="#fff"
            style={{opacity: 0.6}}/>
      </View>

      <Divider style={{opacity: 0.3, marginVertical: 8}}/>
      <View style={{display: "flex", flexDirection: "row"}}>
        <FavouritesScreenNavigationItemIconOnly
            onPress={() => {
              navigation.push("MyFavourites")
            }}
            icon={
              <Ionicons name="star-outline" size={24} color={"#888"}/>
            }
        />
        <FavouritesScreenNavigationItemIconOnly
            onPress={() => {
              navigation.push("MyBookmarks")
            }}
            icon={
              <FontAwesome6 name="bookmark" size={24} color={"#888"}/>
            }
        />
        <FavouritesScreenNavigationItemIconOnly
            onPress={() => {
              console.log("[INFO]: user wants to see their mute list")
            }} icon={
          <FontAwesome6 name="hashtag" size={24} color={"#888"}/>
        }
        />
        <FavouritesScreenNavigationItemIconOnly
            onPress={() => {
              console.log("[INFO]: user wants to see their mute list")
            }} icon={
          <FontAwesome color={"#888"} name="photo" size={24}/>
        }
        />
      </View>
    </View>
    <View style={{
      borderWidth: 1,
      borderColor: "#ffffff30",
      borderRadius: 8,
      padding: 8,
      marginHorizontal: 8
    }}>
      <View style={{
        marginHorizontal: 8,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
      }}>
        <Text
            style={{fontSize: 20, color: "#fff", opacity: 0.87}}>
          Your Network
        </Text>
        <FontAwesome
            name="chevron-down" size={24} color="#fff"
            style={{opacity: 0.6}}/></View>
      <Divider style={{opacity: 0.3, marginVertical: 8}}/>
      <View style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        paddingHorizontal: 8,
        marginVertical: 8
      }}>
        <FavouritesScreenNavigationItemIconOnly
            onPress={() => {
              navigation.push("MyFollowers")
            }}
            icon={
              <SimpleLineIcons name="user-following" size={24} color="#888"/>
            }/>
        <FavouritesScreenNavigationItemIconOnly
            onPress={() => {
              navigation.push("MyFollowings")
            }}
            icon={
              <SimpleLineIcons name="user-follow" size={24} color="#888"/>
            }/>
        <FavouritesScreenNavigationItemIconOnly
            onPress={() => {
              console.log("[INFO]: user wants to see their mute list")
            }} icon={
          <Ionicons
              style={{marginLeft: 4}}
              name="volume-mute" size={24}
              color={"#888"}/>
        }/>
        <FavouritesScreenNavigationItemIconOnly
            onPress={() => {
              console.log("[INFO]: user wants to see their block list")
            }} icon={
          <MaterialIcons
              name="block"
              size={24}
              color={"#888"}/>
        }/>
      </View>
    </View>

    <View style={{
      borderWidth: 1,
      borderColor: "#ffffff30",
      borderRadius: 8,
      padding: 8,
      marginVertical: 8,
      marginHorizontal: 8
    }}>
      <Text style={{fontSize: 20, color: "#fff", opacity: 0.6}}>Coming
        Soon™</Text>
      <Divider style={{opacity: 0.3, marginVertical: 8}}/>
      <View style={{
        display: "flex", flexDirection: "row",
        width: "100%",
        paddingHorizontal: 8,
        marginTop: 8
      }}>
        <FavouritesScreenNavigationItem
            text={"My Lists"}
            onPress={() => {
              console.log("[INFO]: user wants to see their mute list")
            }} icon={
          <Ionicons
              color={"#888"}
              name={"star-outline"}
              size={24}
              style={{opacity: 0.3}}
          />
        } disabled/>
        <FavouritesScreenNavigationItem
            text={"My Filters"}
            onPress={() => {
              console.log("[INFO]: user wants to see their mute list")
            }} icon={
          <Ionicons
              color={"#888"}
              name={"star-outline"}
              size={24}
              style={{opacity: 0.3}}
          />
        } disabled/>
      </View>
      <View style={{
        display: "flex", flexDirection: "row",
        width: "100%",
        paddingHorizontal: 8,
        marginVertical: 8
      }}>
        <FavouritesScreenNavigationItem
            text={"Scheduled Posts"}
            onPress={() => {
              console.log("[INFO]: user wants to see their mute list")
            }} icon={
          <Ionicons
              color={"#888"}
              name={"star-outline"}
              size={24}
              style={{opacity: 0.3}}
          />
        } disabled/>
        <FavouritesScreenNavigationItem
            text={"My Filters"}
            onPress={() => {
              console.log("[INFO]: user wants to see their mute list")
            }} icon={
          <Ionicons
              color={"#888"}
              name={"star-outline"}
              size={24}
              style={{opacity: 0.3}}
          />
        } disabled/>
      </View>
    </View>
  </View>
}

const Stack = createNativeStackNavigator();

function FavouritesScreenTabSetup() {
  return <View style={{
    display: "flex",
    width: "100%",
    backgroundColor: "#121212",
    height: "100%",
    justifyContent: "flex-end",
    paddingBottom: 8
  }}>
    <View style={{flexGrow: 1}}>
      <FavouritesScreenHomePageDefaultTutorial/>
    </View>
    <View>
      <ActionableSection/>
    </View>
  </View>
}


function WithStackNavigation() {
  return <WithGorhomBottomSheetContext>
    <Stack.Navigator
        initialRouteName={"FavouritesModuleLandingPage"}
        screenOptions={{headerShown: false}}
    >
      <Stack.Screen
          name="FavouritesModuleLandingPage"
          component={FavouritesScreenTabSetup}
      />
      <Stack.Screen
          name="Post"
          component={PostWithClientContext}
      />
      <Stack.Screen name={"MyFavourites"} component={MyFavourites}/>
      <Stack.Screen name={"MyBookmarks"} component={MyBookmarks}/>
      <Stack.Screen name={"MyFollowings"} component={MyFollowings}/>
      <Stack.Screen name={"MyFollowers"} component={MyFollowers}/>
    </Stack.Navigator>
  </WithGorhomBottomSheetContext>
}

function FavouritesScreen() {
  return (
      <View style={{height: "100%"}}>
        <WithScrollOnRevealContext>
          <WithStackNavigation/>
        </WithScrollOnRevealContext>
      </View>
  );
}

export default FavouritesScreen;
