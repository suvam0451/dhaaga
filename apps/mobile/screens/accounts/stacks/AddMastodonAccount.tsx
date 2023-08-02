import {
	View,
	TextInput,
	Text,
	Keyboard,
	TouchableOpacity,
	Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import { MastodonService } from "@dhaaga/shared-provider-mastodon/dist";
import { MainText } from "../../../styles/Typography";
import { StandardView } from "../../../styles/Containers";
import { Button } from "@rneui/base";
import WebView from "react-native-webview";

function AccountsScreen({ navigation }) {
	const [InputText, setInputText] = useState("mastodon.social");

	async function onPressNext() {
		const authUrl = await MastodonService.createCodeRequestUrl(
			`https://${InputText}`,
			process.env.EXPO_PUBLIC_MASTODON_CLIENT_ID
		);
		const subdomain = `https://${InputText}`;
		navigation.navigate("Server Sign-In", { signInUrl: authUrl, subdomain });
	}

	const [isKeyboardVisible, setKeyboardVisible] = useState(false);

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			"keyboardDidShow",
			() => {
				setKeyboardVisible(true); // or some other action
			}
		);
		const keyboardDidHideListener = Keyboard.addListener(
			"keyboardDidHide",
			() => {
				setKeyboardVisible(false); // or some other action
			}
		);

		return () => {
			keyboardDidHideListener.remove();
			keyboardDidShowListener.remove();
		};
	}, []);

	const popularServers = [
		{ value: "mastodon.social", label: "mastodon.social" },
		{ value: "fosstodon.org", label: "fosstodon.org" },
		{ value: "pawoo.net", label: "🇯🇵 pawoo.net" },
		{ value: "mastodon.art", label: "mastodon.art" },
		{ value: "mstdn.social", label: "mstdn.social" },
		{ value: "mastodon.world", label: "mastodon.world" },
		{ value: "pixelfed.social", label: "pixelfed.social" },
		{ value: "mstdn.jp", label: "🇯🇵 mstdn.jp" },
		{ value: "mastodon.cloud", label: "mastodon.cloud" },
		{ value: "mastodon.online", label: "mastodon.online" },
	];

	return (
		<StandardView
			style={{
				display: "flex",
				justifyContent: "space-between",
				height: "100%",
				marginTop: 16,
			}}
		>
			<View>
				{!isKeyboardVisible && (
					<View>
						<MainText style={{ marginBottom: 16 }}>
							Step 1: Select your server
						</MainText>

						<View style={{ flexDirection: "row", flexWrap: "wrap" }}>
							{popularServers.map((server, i) => (
								<TouchableOpacity
									key={i}
									onPress={() => {
										setInputText(server.value);
									}}
								>
									<View
										style={{
											padding: 8,
											margin: 4,
											backgroundColor: "lightblue",
											borderRadius: 4,
										}}
									>
										<Text>{server.label}</Text>
									</View>
								</TouchableOpacity>
							))}
						</View>
					</View>
				)}

				<MainText style={{ marginTop: 32, marginBottom: 12 }}>
					Or, enter it manually
				</MainText>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
					}}
				>
					<Text style={{ fontSize: 16, color: "gray" }}>https://</Text>
					<TextInput
						style={{
							fontSize: 16,
							color: "blue",
							textDecorationLine: "underline",
						}}
						placeholder="mastodon.social"
						defaultValue="mastodon.social"
						onChangeText={setInputText}
						value={InputText}
					/>
					<Text style={{ fontSize: 16, color: "gray" }}>/oauth/authorize</Text>
				</View>
			</View>
			<View style={{ marginBottom: 32 }}>
				<Button style={{ width: 100, marginBottom: 32 }} onPress={onPressNext}>
					Next
				</Button>
			</View>
		</StandardView>
	);
}

export default AccountsScreen;
