import {View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {Text} from "@rneui/themed";
import React from "react";

type Props = {
  fromLang: string,
  toLang: string
  additionalInfo: string,
  text: string
}

/**
 * Container for the AI prompt output
 * @param text
 * @param fromLang
 * @param toLang
 * @param additionalInfo
 * @constructor
 */
function ExplainOutput({text, fromLang, toLang, additionalInfo}: Props) {
  return <View style={{
    backgroundColor: "#2E2E2E",
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    marginTop: 8,
    borderRadius: 8,
    marginBottom: 16
  }}>
    <View style={{
      display: "flex",
      flexDirection: "row",
      width: "100%",
      marginBottom: 4
    }}>
      <View style={{
        display: "flex",
        flexDirection: "row",
        flexGrow: 1,
        alignItems: "center"
      }}>
        <View>
          <Ionicons
              color={"#bb86fc"}
              name={"language-outline"}
              size={15}/>
        </View>
        <View>
          <Text style={{
            color: "#bb86fc",
            fontFamily: "Montserrat-Bold"
          }}>
            {` ${fromLang} -> ${toLang}`}
          </Text>
        </View>
      </View>
      <View>
        <Text style={{
          color: "#ffffff38",
          flex: 1,
          textAlign: "right",
          fontSize: 14
        }}>{additionalInfo}</Text>
      </View>
    </View>
    <Text
        style={{color: "#ffffff87"}}>{text}</Text>
  </View>
}

export default ExplainOutput