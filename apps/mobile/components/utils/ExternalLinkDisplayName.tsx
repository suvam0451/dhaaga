import {Text} from "@rneui/themed"
import {View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";

type ExternalLinDisplayNameProps = {
  displayName: string
}

function ExternalLinkDisplayName({displayName}: ExternalLinDisplayNameProps) {
  const httpsRemoved = displayName.replace(/(https:\/\/)(.+)/, "$2")
  const wwwRemoved = httpsRemoved.replace(/(www\.)(.+)/, httpsRemoved)

  return <>
    <View style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "flex-end",
      marginBottom: -4
    }}>
      <View style={{
        maxWidth: 240,
        overflow: "hidden"
      }}>
        <Text
            numberOfLines={1}
            style={{
              color: "orange",
              opacity: 1,
            }}
        >{wwwRemoved}</Text>
      </View>
      <View>
        <Ionicons
            name="open-outline"
            size={16}
            color="orange"
        />
      </View>
    </View>
  </>
}

export default ExternalLinkDisplayName