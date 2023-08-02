import { View, Text, TextInput } from "react-native";
import { Input, Icon, Button } from "@rneui/themed";
import { StandardView } from "../../styles/Containers";
import { MainText } from "../../styles/Typography";
import React, { useRef, useState } from "react";

function SelectServer({ Step, nextStep, setAuthUri }: any) {
	const [InputText, setInputText] = useState("mastodon.social");
	function onPressNext() {
		const baseURl = `https://${InputText}/oauth/authorize`;

		// Set up parameters for the query string
		const options: Record<string, string> = {
			client_id: process.env.EXPO_PUBLIC_MASTODON_CLIENT_ID,
			redirect_uri: "urn:ietf:wg:oauth:2.0:oob",
			response_type: "code",
			scope: "read",
		};

		// Generate the query string
		const queryString = Object.keys(options)
			.map((key) => `${key}=${encodeURIComponent(options[key])}`)
			.join("&");

		const url = `${baseURl}?${queryString}`;

		console.log(url);
		setAuthUri(url);
		nextStep();
	}

	return (
		<StandardView style={{ display: "flex", justifyContent: "flex-start" }}>
			<MainText>Step 1: Select your server</MainText>
			<View
				style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
			>
				<Text style={{ fontSize: 16 }}>https://</Text>
				<TextInput
					style={{ fontSize: 16, color: "blue" }}
					placeholder="mastodon.social"
					defaultValue="mastodon.social"
					onChangeText={setInputText}
					value={InputText}
				/>
				<Text style={{ fontSize: 16 }}>/oauth/authorize</Text>
			</View>
			{Step == 0 && (
				<Button style={{ width: 100 }} onPress={onPressNext}>
					Next
				</Button>
			)}
		</StandardView>
	);
}

export default SelectServer;
