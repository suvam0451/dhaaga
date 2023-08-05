import { View, Text } from "react-native";
import { Image } from "expo-image";
import { extractInstanceUrl, visibilityIcon } from "../../utils/instances";
import { formatDistance } from "date-fns";
import React from "react";

type OriginalPosterProps = {
	createdAt: string;
	avatarUrl: string;
	displayName: string;
	accountUrl: string;
	username: string;
	subdomain?: string;
	visibility: string;
};

function OriginalPoster({
	avatarUrl,
	createdAt,
	displayName,
	accountUrl,
	username,
	subdomain,
	visibility,
}: OriginalPosterProps) {
	return (
		<React.Fragment>
			<View
				style={{
					width: 52,
					height: 52,
					borderColor: "gray",
					borderWidth: 1,
					borderRadius: 4,
				}}
			>
				<Image
					style={{
						flex: 1,
						width: "100%",
						backgroundColor: "#0553",
						padding: 2,
					}}
					source={{ uri: avatarUrl }}
				/>
			</View>
			<View style={{ display: "flex", marginLeft: 8, flexGrow: 1 }}>
				<Text style={{ color: "white", fontWeight: "600" }}>{displayName}</Text>
				<Text style={{ color: "#888", fontWeight: "500", fontSize: 12 }}>
					{extractInstanceUrl(accountUrl, username, subdomain)}
				</Text>
				<View style={{ display: "flex", flexDirection: "row" }}>
					<Text style={{ color: "gray", fontSize: 12 }}>
						{formatDistance(new Date(createdAt), new Date(), {
							addSuffix: true,
						})}
					</Text>
					<Text style={{ color: "gray", marginLeft: 2, marginRight: 2 }}>
						•
					</Text>
					{visibilityIcon(visibility)}
				</View>
			</View>
		</React.Fragment>
	);
}

export default OriginalPoster;
