import { View, Text, Dimensions } from "react-native";
import { useState } from "react";
import { StandardView } from "../../../styles/Containers";
import { Button } from "@rneui/base";
import WebView from "react-native-webview";

function SelectAccountStack({ navigation }) {
	return (
		<View style={{ flex: 1 }}>
			<StandardView>
				<Text style={{ fontSize: 24 }}>Select an Account</Text>
				<Text style={{ fontSize: 24 }}>Or add an account</Text>
				<Button
					onPress={() => {
						navigation.navigate("Select a Platform", { type: "mastodon" });
					}}
				>
					Add an Account
				</Button>
			</StandardView>
		</View>
	);
}

export default SelectAccountStack;
