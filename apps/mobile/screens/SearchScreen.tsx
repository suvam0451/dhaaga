import {GestureResponderEvent, View} from "react-native";
import WithScrollOnRevealContext, {
  useScrollOnReveal
} from "../states/useScrollOnReveal";
import WithActivityPubRestClient from "../states/useActivityPubRestClient";
import {SearchBar} from "@rneui/themed";
import React, {useState} from "react";
import {CheckBox} from "@rneui/base";
import appStyling from "../styles/AppStyles";
import SearchResults from "../components/screens/search/SearchResults";
import {
  NativeSyntheticEvent
} from "react-native/Libraries/Types/CoreEventTypes";
import {
  TextInputSubmitEditingEventData
} from "react-native/Libraries/Components/TextInput/TextInput";
import Animated from "react-native-reanimated";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Hashtag from "./shared/Hashtag";
import UserProfile from "./shared/profile/UserProfile";
import PostWithClientContext from "./shared/Post";
import WithAppPaginationContext from "../states/usePagination";

type CheckboxItemProps = {
  selected: boolean
  title: string
  onPress: any
}

const Stack = createNativeStackNavigator();


function CheckboxItem({selected, title, onPress}: CheckboxItemProps) {
  return <CheckBox
      checked={selected}
      onPress={onPress}
      iconType="material-community"
      checkedIcon="checkbox-outline"
      uncheckedIcon={'checkbox-blank-outline'}
      containerStyle={{
        backgroundColor: "#252525",
        flex: 1,
        margin: 0,
        padding: 0,
        marginLeft: 4,
        marginRight: 0
      }}
      textStyle={{color: "#fff", opacity: 0.6}}
      title={title}
  />
}

function Multiselect() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  function onCheckboxPress(idx: number) {
    setSelectedIndex(idx)
  }

  return <View style={{
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "#252525",
    paddingBottom: 12,
    paddingHorizontal: 8
  }}>
    <CheckboxItem onPress={() => {
      onCheckboxPress(0)
    }} title={"All"}
                  selected={selectedIndex === 0}/>
    <CheckboxItem onPress={() => {
      onCheckboxPress(1)
    }} title={"Tags"}
                  selected={selectedIndex === 1}/>
    <CheckboxItem onPress={() => {
      onCheckboxPress(2)
    }} title={"Users"}
                  selected={selectedIndex === 2}/>
    <CheckboxItem onPress={() => {
      onCheckboxPress(3)
    }} title={"Posts"}
                  selected={selectedIndex === 3}/>
  </View>
}

function SearchScreenBase() {
  const [searchBoxText, setSearchBoxText] = useState("");
  const [SearchTerm, setSearchTerm] = useState("")
  const {outputStyle} = useScrollOnReveal()

  const updateSearch = (search: string) => {
    setSearchBoxText(search);
  };

  const submitSearch =
      (search:
          NativeSyntheticEvent<
              TextInputSubmitEditingEventData>) => {
        setSearchTerm(search.nativeEvent.text)
      }

  return <View style={{
    backgroundColor: "#121212",
    flex: 1,
  }}>
    <Animated.View
        style={[appStyling.inputAssistant, outputStyle]}>
      <SearchBar
          onChangeText={updateSearch}
          onSubmitEditing={submitSearch}
          value={searchBoxText}
          containerStyle={{
            width: "100%",
            height: 54,
            backgroundColor: "#252525",
            margin: 0
          }}
          style={{width: "100%"}}
          inputContainerStyle={{height: 36,}}
          inputStyle={{fontSize: 16}}
      />
      <Multiselect/>
    </Animated.View>
    <WithAppPaginationContext>
      <SearchResults q={SearchTerm} type={null}/>
    </WithAppPaginationContext>
  </View>
}


function SearchScreen() {
  return <WithActivityPubRestClient>
    <WithScrollOnRevealContext maxDisplacement={150}>
      <Stack.Navigator initialRouteName={"Search"}
                       screenOptions={{headerShown: false}}
      >
        <Stack.Screen name={"Search"}
                      component={SearchScreenBase}
        />
        <Stack.Screen
            name="Browse Hashtag"
            component={Hashtag}
        />
        <Stack.Screen
            name="Profile"
            component={UserProfile}
        />
        <Stack.Screen
            name="Post"
            component={PostWithClientContext}
        />
      </Stack.Navigator>
    </WithScrollOnRevealContext>
  </WithActivityPubRestClient>
}

export default SearchScreen;
