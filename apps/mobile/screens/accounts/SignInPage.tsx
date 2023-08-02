import React from "react";
import { Dimensions, View, Text } from "react-native";
import { WebView } from "react-native-webview";
import { MainText } from "../../styles/Typography";
import { StandardView } from "../../styles/Containers";
import { Divider } from "@rneui/base";

function SignInWebview({ uri }: { uri: string }) {
	function callback(state) {
		console.log("Callback", state);
		const regex = /^https:\/\/(.*?)\/oauth\/authorize\/native\?(.*?)$/;
		if (regex.test(state.url)) {
			const code = state.url.match(regex)[2];
			console.log(code);
		}
	}

	return (
		<StandardView style={{ flex: 1, marginTop: 12 }}>
			<Divider style={{ marginTop: 4, marginBottom: 4 }} />
			<MainText style={{ marginBottom: 12 }}>
				Step 2: Log into your server
			</MainText>

			<WebView
				style={{ flex: 1, minWidth: Dimensions.get("window").width - 20 }}
				source={{ uri }}
				onNavigationStateChange={callback}
			/>
		</StandardView>
	);
}

export default SignInWebview;
