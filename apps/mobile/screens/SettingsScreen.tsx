import { useState } from "react";
import { View, Text } from "react-native";
import { EmojiRepo } from "../libs/sqlite/repositories/activitypub/emoji.repo";
import { Button } from "@rneui/base";
import { ScrollView } from "react-native";

function SettingsScreen() {
	const [EmojiCount, setEmojiCount] = useState(0);
	const [Emojis, setEmojis] = useState([]);

	async function onClick() {
		console.log("button clicked!!!");
		try {
			const res = await EmojiRepo.searchAll();
			// console.log(res.length);
			setEmojiCount(res.length);
			setEmojis(res.slice(0, 10));
		} catch (e) {
			console.log(e);
		}
	}
	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<ScrollView>
				<Text>Settings!</Text>
				<Text>{EmojiCount}</Text>
				{Emojis.map((o, i) => (
					<Text style={{ color: "black" }} key={i}>
						{o.name}
					</Text>
				))}
			</ScrollView>
			<Button onPress={onClick}>Click Me!</Button>
		</View>
	);
}

export default SettingsScreen;
