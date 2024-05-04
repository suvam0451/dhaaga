import { mastodon } from "@dhaaga/shared-provider-mastodon/src";
import { View, Text } from "react-native";

function EmojiBoard({ status }: { status: mastodon.v1.Status }) {
	return (
		<View>
			{status.emojis.map((emoji) => (
				<Text style={{color: "white"}}>{emoji.shortcode}</Text>
			))}
		</View>
	);
}

export default EmojiBoard;
