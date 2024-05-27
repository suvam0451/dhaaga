import {View} from "react-native";
import React from "react";
import {Text} from "@rneui/themed"
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

function FavouritesScreenHomePageDefaultTutorial() {
  return <View style={{padding: 8}}>
    <View style={{
      padding: 16,
      position: "relative",
      borderWidth: 2,
      borderColor: "#ffffff60",
      borderRadius: 8,
      marginTop: 16
    }}>
      <View style={{
        display: "flex",
        position: "absolute",
        left: "100%",
      }}>
        <View style={{marginTop: 8, marginLeft: -4}}>
          <MaterialIcons
              name="help-outline" size={24}
              style={{opacity: 0.87, marginLeft: 4}}
              color="#fff"/>
        </View>
      </View>

      <Text style={{fontSize: 24, textAlign: "center", opacity: 0.87}}>
        Welcome !
      </Text>

      <Text style={{fontSize: 18, textAlign: "center", opacity: 0.6}}>
        Here, you can browse your saved statuses/tags and manage your network.
      </Text>
      <Text style={{fontSize: 18, textAlign: "center", opacity: 0.6}}>
        If you are new to mastodon and need help, click help icon for a
        explainer
        😉
      </Text>
    </View>
  </View>
}

export default FavouritesScreenHomePageDefaultTutorial