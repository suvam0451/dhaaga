import {Text} from "@rneui/themed"
import {View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {APP_THEME} from "../../styles/AppTheme";

type ExternalLinDisplayNameProps = {
  displayName: string
}

function ExternalLinkDisplayName({displayName}: ExternalLinDisplayNameProps) {
  const httpsRemoved = displayName.replace(/(https:\/\/)(.+)/, "$2")
  const wwwRemoved = httpsRemoved.replace(/(www\.)(.+)/, httpsRemoved)

  return <View style={{
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    marginBottom: -4,
    marginLeft: 8,
    maxWidth: 196,
  }}>
    <Text
        numberOfLines={1}
        style={{
          color: APP_THEME.LINK,
          fontFamily: "Inter-Bold"
        }}
    >{wwwRemoved}</Text>
    <Ionicons
        name="open-outline"
        size={16}
        color={APP_THEME.LINK}
    />

  </View>
}

export default ExternalLinkDisplayName