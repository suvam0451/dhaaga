import {View} from "react-native";
import React from "react";
import {Text} from "@rneui/themed"

function SearchScreenManual() {
  return <View style={{
    display: "flex",
    alignItems: "center",
    marginTop: 32,
    padding: 16
  }}>
    <View style={{
      borderWidth: 1,
      borderColor: "#ffffff60",
      padding: 16,
      borderRadius: 16,
      display: "flex",
      alignItems: "center",
    }}>
      <Text style={{opacity: 0.87, fontSize: 20}}>⌨️ to get started</Text>
      <View style={{width: "100%", display: "flex", marginVertical: 16}}>
        <Text> --- OR --- </Text>
      </View>

      <Text>Browse some photography from your
        community.</Text>

      <Text style={{color: "orange", fontSize: 18, margin: 8}}>sunset 🌆</Text>
      <Text style={{color: "orange", fontSize: 18, margin: 8}}>nightsky 🌙</Text>
      <Text style={{color: "orange", fontSize: 18, margin: 8}}>wildlifephotography
        🐾</Text>
    </View>
  </View>
}

export default SearchScreenManual