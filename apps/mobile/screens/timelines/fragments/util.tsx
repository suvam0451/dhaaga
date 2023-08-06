import { mastodon } from "@dhaaga/shared-provider-mastodon/dist";
import { MfmNode } from "@dhaaga/shared-utility-html-parser/dist";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "@rneui/base";
import React from "react";
import { Text } from "react-native";
import HashtagProcessor from "../link-processors/Hashtags";

export function parseNode(
	node: MfmNode,
	count: string,
	emojis: mastodon.v1.CustomEmoji[]
) {
	switch (node.type) {
		case "unicodeEmoji": {
			return <Text key={count}>{node.props.emoji}</Text>;
		}
		case "text": {
			let baseText = node.props.text;
			baseText = baseText.replaceAll(/<br>/g, "\n");
			return (
				<Text key={count} style={{ color: "white" }}>
					{baseText}
				</Text>
			);
		}
		case "hashtag": {
			return (
				<HashtagProcessor key={count} forwardedKey={count} content={node.props.hashtag} />
			);
		}
		case "url": {
			return (
				<React.Fragment>
					<Text key={count} style={{ color: "orange" }}>
						{node.props.url}
					</Text>
					<Ionicons
						name="open-outline"
						style={{
							marginLeft: 2,
							paddingLeft: 2,
						}}
						size={18}
						color="orange"
					/>
				</React.Fragment>
			);
		}
		case "emojiCode": {
			const renderer = emojis?.find((o) => o.shortcode === node.props.name);
			if (renderer) {
				return (
					<Image
						key={count}
						style={{
							width: 16,
							height: 16,
						}}
						source={{ uri: renderer.staticUrl }}
					/>
				);
			}
			return (
				<Text key={count} style={{ color: "#888" }}>
					:{node.props.name}:
				</Text>
			);
		}
		case "italic": {
			return (
				<Text style={{ color: "white", fontStyle: "italic" }}>
					{node.children.map((o, i) =>
						parseNode(o, count + "." + i.toString(), emojis)
					)}
				</Text>
			);

			// <Text key={count} style={{ color: "white", fontStyle: "italic" }}>
			// 		{node.children}
			// 	</Text>
		}
		default: {
			console.log("[WARN]: node type not evaluated", node);
			return <Text key={count}></Text>;
		}
	}
}
