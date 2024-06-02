import React from "react";
import {StyleSheet, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Text} from "@rneui/themed"

type HeadersProps = {
  HIDDEN_SECTION_HEIGHT: number;
  SHOWN_SECTION_HEIGHT: number;
};
const TimelinesHeader = ({
  HIDDEN_SECTION_HEIGHT,
  SHOWN_SECTION_HEIGHT,
}: HeadersProps) => {
  return (
      <>
        <View
            style={[
              styles.subHeader,
              {
                backgroundColor: "#222222",
                height: HIDDEN_SECTION_HEIGHT,
              },
            ]}
        >
          <Ionicons name="menu" size={24} color="white" style={{opacity: 0.6}}/>
          <View style={{
            display: "flex", flexDirection: "row",
            alignItems: "center",
          }}>
            <Text style={[styles.conversation, {opacity: 0.6}]}>Home</Text>
            <Ionicons name="chevron-down" color={"white"} size={20}
                      style={{opacity: 0.6, marginLeft: 4, marginTop: 2}}/>
          </View>

          <Ionicons name="settings-outline" size={24} color="white"
                    style={{opacity: 0.6}}/>
        </View>
      </>
  );
};

const styles = StyleSheet.create({
  subHeader: {
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#1c1c1c",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  conversation: {color: "white", fontSize: 16, fontWeight: "bold"},
  searchText: {
    color: "#8B8B8B",
    fontSize: 17,
    lineHeight: 22,
    marginLeft: 8,
  },
  searchBox: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#0F0F0F",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
export default TimelinesHeader;
