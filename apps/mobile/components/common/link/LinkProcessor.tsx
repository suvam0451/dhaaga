import {Text, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";

type LinkProcessorProps = {
  url: string,
  displayName: string
}

function LinkProcessor({url, displayName}: LinkProcessorProps) {
  return <>
    <View>
      <Text style={{
        color: "orange",
        opacity: 1,
        paddingRight: 4
      }}>{displayName}</Text>
      <Ionicons
          name="open-outline"
          style={{
            marginLeft: 4,
            paddingLeft: 2,
          }}
          size={18}
          color="orange"
      />
    </View>
  </>
}

export default LinkProcessor