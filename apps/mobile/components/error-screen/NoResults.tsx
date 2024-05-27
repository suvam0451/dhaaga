import {View} from "react-native";
import {Text} from "@rneui/themed"
import React from "react";

type NoResultsProps = {
  text: string
  subtext: string
}

function NoResults({text, subtext}: NoResultsProps) {
  return <View style={{
    display: "flex",
    alignItems: "center",
    marginTop: 32,
    padding: 16,
  }}>
    <View style={{
      borderWidth: 1,
      borderColor: "#ffffff60",
      padding: 16,
      borderRadius: 16,
      display: "flex",
      alignItems: "center",
      maxWidth: 360
    }}>
      <Text style={{fontSize: 24}}>{text}</Text>
      <Text style={{fontSize: 16, opacity: 0.6}}>{subtext}</Text>
    </View>
  </View>
}

export default NoResults