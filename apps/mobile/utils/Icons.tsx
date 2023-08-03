import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Octicons from "@expo/vector-icons/Octicons";
import Foundation from "@expo/vector-icons/Foundation";
import Ionicons from "@expo/vector-icons/Ionicons";

export const icons = {
	MaterialCommunityIcons,
	MaterialIcons,
	Ionicons,
	Feather,
	FontAwesome,
	FontAwesome5,
	AntDesign,
	Entypo,
	SimpleLineIcons,
	Octicons,
	Foundation,
};

/**
 * Helper function to render icons
 * @param param0 
 * @returns 
 */
const Icons = ({ icon, name, color, size = 24, style }: any) => {
	const fontSize = 24;
	const Tag = icon;
	return (
		<>
			{icon && (
				<Tag name={name} size={size || fontSize} color={color} style={style} />
			)}
		</>
	);
};

export default Icons;
