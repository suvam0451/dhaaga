import { mastodon } from "@dhaaga/shared-provider-mastodon/dist";
import { Image } from "expo-image";
import { View, Text, Dimensions } from "react-native";
import HTML from "react-native-render-html";
import { StandardView } from "../../../styles/Containers";
import { Divider } from "@rneui/base";
import ImageCarousal from "./ImageCarousal";
import StatusInteraction from "./StatusInteraction";
import { Ionicons } from "@expo/vector-icons";
import { formatDistance } from "date-fns";
import EmojiBoard from "./EmojiBoard";
import { useEffect, useState } from "react";
import * as htmlparser2 from "htmlparser2";
import { parseStatusContent } from "@dhaaga/shared-utility-html-parser/dist";
import React from "react";
import { parseNode } from "./util";

type StatusFragmentProps = {
	status: mastodon.v1.Status;
};

function RootStatusFragment({ status }: StatusFragmentProps) {
	const [Content, setContent] = useState([]);

	useEffect(() => {
		const parsed = parseStatusContent(status.content);

		let retval = [];
		let count = 0; //
		for (const para of parsed) {
			for (const node of para) {
				retval.push(parseNode(node, count.toString(), status.emojis));
				count++;
			}
		}
		setContent(retval);
	}, [status]);

	return (
		<StandardView>
			<View style={{ display: "flex", flexDirection: "row", marginTop: 16 }}>
				<View
					style={{
						width: 48,
						height: 48,
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
						source={{ uri: status.account.avatar }}
					/>
				</View>
				<View style={{ display: "flex", marginLeft: 8, flexGrow: 1 }}>
					<Text style={{ color: "white", fontWeight: "600" }}>
						{status.account.displayName}
					</Text>
					<Text style={{ color: "#888", fontWeight: "500" }}>
						{status.account.username}
					</Text>
					<Text>
						{formatDistance(new Date(status.createdAt), new Date(), {
							addSuffix: true,
						})}
					</Text>
				</View>
				<View>
					<Ionicons name="ellipsis-horizontal" size={24} color="#888" />
				</View>
			</View>

			{/* <HTML
				baseStyle={{ color: "white" }}
				contentWidth={Dimensions.get("window").width}
				source={{ html: status.content as any }}
			/> */}
			<Text>{Content}</Text>

			<ImageCarousal attachments={status.mediaAttachments} />
			<EmojiBoard status={status} />
			<StatusInteraction post={status} statusId={status.id} />
			<Divider />
		</StandardView>
	);
}
function SharedStatusFragment({
	status,
	postedBy,
}: StatusFragmentProps & { postedBy: mastodon.v1.Account }) {
	return (
		<View>
			<Text style={{ color: "white" }}>{postedBy.username}</Text>
			<Text style={{ color: "white" }}>boosted</Text>
			<RootStatusFragment status={status} />
		</View>
	);
}

function StatusFragment({ status }: StatusFragmentProps) {
	if (status.reblog) {
		return (
			<SharedStatusFragment status={status.reblog} postedBy={status.account} />
		);
	}
	return <RootStatusFragment status={status} />;
}

export default StatusFragment;
