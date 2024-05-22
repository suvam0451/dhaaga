import {Text, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, {useState} from "react";
import WithOpenGraph from "./WithOpenGraph";
import {BottomSheet} from "@rneui/themed";

type LinkProcessorProps = {
  url: string,
  displayName: string
}



function LinkProcessor({url, displayName}: LinkProcessorProps) {
  return <WithOpenGraph url={url}>
    <Text style={{
      color: "orange",
      opacity: 1,
      paddingRight: 4
    }}>{displayName || url}
      <Ionicons
          name="open-outline"
          style={{
            marginLeft: 4,
            paddingLeft: 2,
          }}
          size={18}
          color="orange"
      />
    </Text>
  </WithOpenGraph>
}

export default LinkProcessor