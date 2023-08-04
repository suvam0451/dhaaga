import { mastodon } from "@dhaaga/shared-provider-mastodon/dist";
import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

type StatusInteractionProps = {
	statusId: string;
	post: mastodon.v1.Status;
};

const ICON_SIZE = 18

function StatusInteraction({ statusId, post }: StatusInteractionProps) {
	return (
		<View
			style={{
				display: "flex",
				justifyContent: "space-between",
				flexDirection: "row",
				marginBottom: 8,
				marginTop: 12
			}}
		>
			<View
				style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
			>
				<Ionicons color={"#888"} name={"arrow-undo-outline"} size={ICON_SIZE} />
				<Text style={{ color: "#888", marginLeft: 4, fontSize: 16 }}>
					{post.repliesCount}
				</Text>
			</View>
			<View
				style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
			>
				<Ionicons color={"#888"} name={"star-outline"} size={ICON_SIZE} />
				<Text style={{ color: "#888", marginLeft: 4, fontSize: 16 }}>
					{post.favouritesCount}
				</Text>
			</View>
			<View
				style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
			>
				<Ionicons color={"#888"} name={"rocket-outline"} size={ICON_SIZE} />
				<Text style={{ color: "#888", marginLeft: 4, fontSize: 16 }}>
					{post.reblogsCount}
				</Text>
			</View>
			<Ionicons color={"#888"} name={"bookmark-outline"} size={ICON_SIZE} />
      <Ionicons color={"#888"} name={"language-outline"} size={ICON_SIZE} />
		</View>
	);
}

export default StatusInteraction;
