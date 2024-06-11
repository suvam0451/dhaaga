import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type HeadersProps = {
  HIDDEN_SECTION_HEIGHT: number;
  SHOWN_SECTION_HEIGHT: number;
};
const Header = ({
  HIDDEN_SECTION_HEIGHT,
  SHOWN_SECTION_HEIGHT,
}: HeadersProps) => {
  return (
    <>
      <View
        style={[
          styles.subHeader,
          {
            backgroundColor: "red",
            height: HIDDEN_SECTION_HEIGHT,
          },
        ]}
      >
        <Ionicons name="menu" size={24} color="white" />
        <Text style={styles.conversation}>Home</Text>
        <Ionicons name="add" size={24} color="white" />
      </View>
      <View
        style={[
          styles.subHeader,
          {
            height: SHOWN_SECTION_HEIGHT,
          },
        ]}
      >
        <View style={styles.searchBox}>
          <Ionicons name="search" size={24} color="#8B8B8B" />
          <Text style={styles.searchText}>Search for messages or users</Text>
        </View>
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
  conversation: { color: "white", fontSize: 16, fontWeight: "bold" },
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
export default Header;
