import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

type HeadersProps = {
	HIDDEN_SECTION_HEIGHT: number;
	SHOWN_SECTION_HEIGHT: number;
};
const TimelinesHeader = ({
	HIDDEN_SECTION_HEIGHT,
	SHOWN_SECTION_HEIGHT,
}: HeadersProps) => {
	console.log("")
	return (
		<>
			<View
				style={[
					styles.subHeader,
					{
						backgroundColor: "#1c1c1c",
						height: HIDDEN_SECTION_HEIGHT,
					},
				]}
			>
				<Ionicons name="menu" size={24} color="white" />
				<View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
					<Text style={styles.conversation}>Home</Text>
					<Ionicons name="chevron-down" color={"white"} size={20} />
				</View>

				<Ionicons name="settings-outline" size={24} color="white" />
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
export default TimelinesHeader;
